import Joi from 'joi'
import sqlz from '@/backend/configs/db'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import ContentRequestMember from '@/backend/models/contentrequestmember'
import ContentRequestPayment from '@/backend/models/contentrequestpayment'
import { createUserWalletHistory } from '@/backend/services/wallet-history'

import '@/backend/models/association'

// ** User > Content Request > Payment > Read All
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Check Content Request Ada
  const currContentRequest = await ContentRequest.findOne({
    where: { id },
    include: {
      model: ContentRequestPayment,
      include: {
        model: User,
        attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email']
      }
    },
    attributes: ['id', 'creatorRef', 'applicantRef', 'contentRef', 'status', 'createdAt', 'updatedAt']
  })

  if (!currContentRequest) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  } else {
    return Response.json(currContentRequest.dataValues?.ContentRequestPayments ?? [], { status: 200 })
  }
}

// ** User > Content Request > Payment > Add Payment
export async function POST(request, response) {
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
    nominal: Joi.number().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    let finalNominal = Number(req.nominal ?? 0)
    // * Cek Content Request Ada
    const currContentRequest = await ContentRequest.findOne({
      where: { id },
      attributes: [
        'id',
        'creatorRef',
        'applicantRef',
        'contentRef',
        'status',
        'price',
        'leftoverPrice',
        'createdAt',
        'updatedAt'
      ]
    })
    if (!currContentRequest) {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Content Request dalam status waiting-payment
    if (currContentRequest.status !== 'waiting-payment') {
      res = { message: responseString.CONTENT_REQUEST.NOT_WAITING_PAYMENT }
      return Response.json(res, { status: 404 })
    }

    // * Cek User adalah member dari content request
    if (currContentRequest.applicantRef !== user.id) {
      const existingMember = await ContentRequestMember.findOne({
        where: { userRef: Number(user.id) }
      })
      if (!existingMember) {
        res = { message: responseString.CONTENT_REQUEST.NOT_A_MEMBER }
        return Response.json(res, { status: 400 })
      }
    }

    // * Cek Dana Masuk berlebih
    if (finalNominal > currContentRequest.leftoverPrice) {
      // ! Option 1: Dibuat paksa pas in
      // finalNominal = currContentRequest.leftoverPrice
      // ! Option 2: Dibuat gagalin
      res = { message: responseString.CONTENT_REQUEST.PAYMENT_OVERPAID }
      return Response.json(res, { status: 400 })
    }

    // * Cek User saldo cukup
    const currUser = await User.findOne({
      where: { id: Number(user.id) },
      attributes: ['id', 'saldo']
    })
    if (Number(currUser.saldo) < finalNominal) {
      res = { message: responseString.USER.INUFICENT_BALANCE }
      return Response.json(res, { status: 400 })
    }

    // * Build Data
    const newPayment = ContentRequestPayment.build({
      contentRequestRef: Number(currContentRequest.id),
      userRef: Number(user.id),
      nominal: finalNominal
    })

    // * Insert DB
    const t = await sqlz.transaction()

    try {
      await currUser.decrement('saldo', { by: finalNominal, transaction: t })
      await newPayment.save({ transaction: t })
      await currContentRequest.decrement('leftoverPrice', { by: finalNominal, transaction: t })
      await createUserWalletHistory(
        t,
        currUser.id,
        finalNominal,
        'out',
        'Bayar Request Content',
        `Request Content dengan ID [${currContentRequest.id}]`
      )

      await t.commit()
    } catch (e) {
      await t.rollback()
      res = { message: responseString.GLOBAL.FAILED, error: e }
      return Response.json(res, { status: 400 })
    }

    // ** After success trigger: check and update status content request
    await currContentRequest.reload()
    if (Number(currContentRequest.leftoverPrice) <= 0) {
      currContentRequest.status = 'waiting-creator-confirmation'
    } else {
      currContentRequest.status = 'waiting-payment'
    }
    await currContentRequest.save()

    // const allPayments = await ContentRequestPayment.findAll({
    //   where: { contentRequestRef: currContentRequest.id },
    //   attributes: ['id', 'nominal']
    // })
    // let currTotal = 0
    // for (let i = 0; i < allPayments.length; i++) {
    //   const currPayment = allPayments[i]
    //   currTotal += Number(currPayment.nominal)
    // }

    // if (currTotal >= Number(currContentRequest.price)) {
    //   // * Update status content request
    //   currContentRequest.status = 'waiting-creator-confirmation'
    //   await currContentRequest.save()
    // }

    // ** Return Response
    return Response.json(
      {
        message: 'Pembayaran berhasil diterima!'
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
