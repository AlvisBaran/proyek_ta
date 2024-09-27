import Joi from 'joi'
import { v4 as UUD4 } from 'uuid'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { createUserWalletHistory } from '@/backend/services/wallet-history'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { buildSystemLog } from '@/utils/logHelper'

import sqlz from '@/backend/configs/db'
import TransWithdraw from '@/backend/models/transwithdraw'
import User from '@/backend/models/user'
import Bank from '@/backend/models/bank'

import '@/backend/models/association'
import { mainBucketName, minioClient } from '@/minio/config'

// ** Admin > Request Withdraw > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek user is admin
  if (user.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 400 })
  }

  return await TransWithdraw.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ['id', 'cUsername', 'email', 'displayName']
      },
      {
        model: Bank
      }
    ]
  })
    .then(resp => {
      return Response.json(resp.dataValues, { status: 200 })
    })
    .catch(error => {
      res = { message: responseString.GLOBAL.NOT_FOUND, error }
      return Response.json(res, { status: 404 })
    })
}

// ** Admin > Request Withdraw > Accpet/Reject
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    const formData = await request.formData()
    req.action = formData.get('action')
    req.proofOfTransfer = formData.get('proofOfTransfer')
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    action: Joi.valid('accept', 'reject').required(),
    proofOfTransfer: Joi.object().allow(null).optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // ** Cek user ada
    const { user, error } = await getUserFromServerSession(request, response)
    if (!!error) {
      res = { message: error.message }
      return Response.json(res, { status: error.code })
    }

    // * Cek user is admin
    if (user.role !== 'admin') {
      res = { message: responseString.USER.NOT_ADMIN }
      return Response.json(res, { status: 400 })
    }

    // * Cek Withdraw ada
    const currWithdraw = await TransWithdraw.findByPk(id, {
      include: [Bank]
    })
    if (!currWithdraw) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek User ada
    const targetUser = await User.findByPk(currWithdraw.userRef)
    if (!targetUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Saldo User yg dituju cukup
    if (targetUser.saldo < currWithdraw.nominal) {
      res = { message: responseString.USER.INUFICENT_BALANCE }
      return Response.json(res, { status: 400 })
    }

    if (req.action === 'accept') {
      const t = await sqlz.transaction()

      try {
        // * Tarik uang dari user
        await targetUser.decrement('saldo', { by: Number(currWithdraw.nominal), transaction: t })
        // * Update Data
        const prefix = currWithdraw.nomorRekening ?? currWithdraw.id
        if (!prefix) throw new Error(buildSystemLog('Error something wrong with prefix'))
        const newGalleryObjectId = UUD4()
        const extension = String(req.proofOfTransfer.name).split('.').pop() ?? 'png'
        const newMinioObjectName = `proof-of-transfer/${prefix}/${newGalleryObjectId}-${new Date().getTime()}.${extension}`
        // * Mencoba masukkan ke minio
        const bytes = await req.proofOfTransfer.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await minioClient
          .putObject(mainBucketName, newMinioObjectName, buffer)
          .then(async objInfo => {
            console.log(`uploading min.io success [${newMinioObjectName}]`, objInfo)
            currWithdraw.proofOfTransfer = newMinioObjectName
          })
          .catch(error => {
            console.error('error min.io uploading process', error)
            throw new Error(buildSystemLog('Error something wrong with min.io uploading process'))
          })
        const successNote = `Penarikan saldo sebesar Rp ${intlNumberFormat(currWithdraw.nominal)} berhasil!`
        currWithdraw.status = 'approved'
        currWithdraw.note = successNote
        await currWithdraw.save({ transaction: t })
        await createUserWalletHistory(t, targetUser.id, Number(currWithdraw.nominal), 'out', 'Withdraw', successNote)

        await t.commit()

        await currWithdraw.reload()
        return Response.json(currWithdraw.dataValues, { status: 200 })
      } catch (e) {
        await t.rollback()
        res = { message: responseString.GLOBAL.FAILED, error: e }
        return Response.json(res, { status: 400 })
      }
    } else {
      // * Update Status
      currWithdraw.status = 'declined'
      currWithdraw.note = `Penarikan saldo sebesar Rp ${intlNumberFormat(currWithdraw.nominal)} tidak disetujui admin!`
      await currWithdraw.save()
      await currWithdraw.reload()
      return Response.json({ data: currWithdraw.dataValues, message: currWithdraw.note }, { status: 200 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
