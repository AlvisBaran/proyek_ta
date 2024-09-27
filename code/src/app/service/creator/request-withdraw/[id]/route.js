import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Bank from '@/backend/models/bank'
import TransWithdraw from '@/backend/models/transwithdraw'

import '@/backend/models/association'
import { mainBucketName, minioClient } from '@/minio/config'

// ** Creator > Request Withdraw > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek user is creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 400 })
  }

  return await TransWithdraw.findOne({
    where: {
      id,
      userRef: user.id
    },
    include: [
      {
        model: Bank
      }
    ]
  })
    .then(async resp => {
      let proofOfTransferUrl = null
      if (!!resp.proofOfTransfer) {
        await minioClient
          .presignedGetObject(mainBucketName, resp.proofOfTransfer)
          .then(url => {
            proofOfTransferUrl = url
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }
      return Response.json(
        { ...resp.dataValues, Bank: { ...resp.Bank.dataValues }, proofOfTransferUrl },
        { status: 200 }
      )
    })
    .catch(error => {
      res = { message: responseString.GLOBAL.NOT_FOUND, error }
      return Response.json(res, { status: 404 })
    })
}

// ** Creator > Request Withdraw > Update
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    nomorRekening: Joi.string()
      .regex(/^[0-9]*$/)
      .optional(),
    bankRef: Joi.number().optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // ** Cek user ada
    const { user, error } = await getUserFromServerSession(request, response)
    if (!!error) {
      res = { message: error.message }
      return Response.json(res, { status: error.code })
    }

    // * Cek user is creator
    if (user.role !== 'creator') {
      res = { message: responseString.USER.NOT_CREATOR }
      return Response.json(res, { status: 400 })
    }

    // * Cek withdraw ada
    const currWithdraw = await TransWithdraw.findOne({
      where: {
        id,
        userRef: user.id
      },
      include: [Bank]
    })
    if (!currWithdraw) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek status withdraw masih on-hold
    if (currWithdraw.status !== 'on-hold') {
      res = { message: 'Status transaksi sekarang bukan on-hold!' }
      return Response.json(res, { status: 400 })
    }

    const oldValue = currWithdraw.dataValues
    const changedAttributes = []

    if (!!req.nomorRekening) {
      currWithdraw.nomorRekening = req.nomorRekening
      changedAttributes.push('nomorRekening')
    }
    if (!!req.bankRef) {
      currWithdraw.bankRef = req.bankRef
      changedAttributes.push('bankRef')
    }

    return await currWithdraw
      .save()
      .then(async () => {
        await currWithdraw.reload({ include: [Bank] })
        return Response.json({ oldValue, newValue: currWithdraw.dataValues }, { status: 200 })
      })
      .catch(error => {
        res = { message: responseString.GLOBAL.FAILED, error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
