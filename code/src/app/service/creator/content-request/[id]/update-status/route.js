import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { createUserWalletHistory } from '@/backend/services/wallet-history'
import { PERSENTASE_ADMIN } from '@/utils/constants'

import sqlz from '@/backend/configs/db'
import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'

import '@/backend/models/association'

const ALLOWED_MODE = ['start-progress', 'done-progress', 'confirm-payment']
const ALLOWED_STATUS = {
  START_PROGRESS: ['requested'],
  DONE_PROGRESS: ['on-progress'],
  CONFIRM_PAYMENT: ['waiting-creator-confirmation']
}

// ** Creator > Content Request > Update Status
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    mode: Joi.valid(...ALLOWED_MODE).required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Content Request Ada
    const currCR = await ContentRequest.findOne({
      where: { id, creatorRef: user.id }
    })
    if (!currCR) {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const reloadOptions = {
      include: [
        {
          model: User,
          as: 'ContentRequestor',
          attributes: ['id', 'cUsername', 'displayName', 'email']
        },
        {
          model: Content
        }
      ]
    }

    // * Validasi Status
    if (req.mode === 'start-progress' && ALLOWED_STATUS.START_PROGRESS.includes(currCR.status)) {
      currCR.status = 'on-progress'
      return await currCR.save().then(async () => {
        await currCR.reload(reloadOptions)
        return Response.json({ ...currCR.dataValues }, { status: 200 })
      })
    } else if (req.mode === 'done-progress' && ALLOWED_STATUS.DONE_PROGRESS.includes(currCR.status)) {
      currCR.status = 'waiting-requestor-confirmation'
      return await currCR.save().then(async () => {
        await currCR.reload(reloadOptions)
        return Response.json({ ...currCR.dataValues }, { status: 200 })
      })
    } else if (req.mode === 'confirm-payment' && ALLOWED_STATUS.CONFIRM_PAYMENT.includes(currCR.status)) {
      const t = await sqlz.transaction()
      const BIAYA_ADMIN = Math.floor((Number(currCR.price) * PERSENTASE_ADMIN) / 100)

      try {
        currCR.status = 'done'
        await currCR.save({ transaction: t })

        // * Add Saldo and Wallet History ke Creator
        const currCreator = await User.findByPk(user.id)
        if (!!currCreator) {
          const incomeCreator = Number(currCR.price) - BIAYA_ADMIN
          currCreator.increment('saldo', { by: incomeCreator, transaction: t })
          await createUserWalletHistory(
            t,
            currCreator.id,
            incomeCreator,
            'in',
            'Pemasukan Request Content',
            `Request Content dengan ID [${currCR.id}]`
          )
        }

        // * Add Saldo and Wallet History ke Admin
        const currAdmin = await User.findByPk(1)
        if (!!currAdmin) {
          currAdmin.increment('saldo', { by: BIAYA_ADMIN, transaction: t })
          await createUserWalletHistory(
            t,
            currAdmin.id,
            BIAYA_ADMIN,
            'in',
            'Pemasukan Request Content',
            `Request Content dengan ID [${currCR.id}] dari Creator dengan ID [${currCreator.id}]`
          )
        }

        await t.commit()
      } catch (e) {
        await t.rollback()
        res = { message: responseString.GLOBAL.FAILED, error: e }
        return Response.json(res, { status: 400 })
      }

      // * After Success
      await currCR.reload(reloadOptions)
      return Response.json({ ...currCR.dataValues }, { status: 200 })
    } else {
      res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
