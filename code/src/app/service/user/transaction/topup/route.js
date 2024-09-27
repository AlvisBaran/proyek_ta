import Joi from 'joi'
import dayjs from 'dayjs'
import { responseString } from '@/backend/helpers/serverResponseString'
import { createTopUpPaymentLink } from '@/backend/services/midtrans'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import TransTopup from '@/backend/models/transtopup'

import '@/backend/models/association'

const TOTAL_MIDTRANS_RETRY = 1

// ** Transaction > Top Up > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const filterStatus = searchParams.get('filterStatus') ?? 'all'
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  let transactions = []
  let whereAttributes = {}

  if (filterStatus === 'success' || filterStatus === 'pending' || filterStatus === 'failed') {
    whereAttributes = {
      ...whereAttributes,
      status: filterStatus
    }
  }

  return await TransTopup.findAll({
    where: whereAttributes,
    order: [['createdAt', 'DESC']]
    // include: {
    //   model: User,
    //   attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"]
    // }
  })
    .then((resp = []) => {
      resp?.map(datum => transactions.push({ ...datum?.dataValues }))

      return Response.json(transactions, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR, error: err }, { status: 500 })
    })
}

// ** Transaction > Top Up > Create
export async function POST(request, response) {
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
    nominal: Joi.number().greater(9999).less(50000000).required()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    const { nominal } = req
    // Mencoba untuk terus mencoba membuat transaction selama gagal
    // namun tidak sampai lebih dari TOTAL_MIDTRANS_RETRY
    let newId = undefined
    let newMidtransData = null
    let tryCounter = 0
    do {
      tryCounter++
      newId = `TT-${dayjs(new Date()).format('YYYYMMYYHHmmss')}${Math.floor(Math.random() * 1000 + 1)}`
      let tempMidtransResponse = await createTopUpPaymentLink(
        newId,
        nominal,
        `${user.cUsername ?? user.displayName}`,
        user.email
      )
      // console.info(tryCounter, tempMidtransResponse)
      if (!!tempMidtransResponse && tempMidtransResponse.success) {
        newMidtransData = {
          paymentUrl: tempMidtransResponse.success.paymentUrl,
          transactionId: tempMidtransResponse.success.orderId
        }
      } else {
        res = { ...tempMidtransResponse.error }
      }
      if (tryCounter >= 20) throw new Error('limit breaker exceeded')
    } while (!newMidtransData || tryCounter < TOTAL_MIDTRANS_RETRY)

    // Jika midtrans success maka buat database record
    let newTopUpData = TransTopup.build({
      userRef: user.id,
      invoice: newMidtransData.transactionId,
      nominal: Number(nominal),
      status: 'pending',
      mt_payment_link: newMidtransData.paymentUrl
    })

    return await newTopUpData
      .save()
      .then(async resp => {
        await newTopUpData.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newTopUpData.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: res.message }, serverMessage: responseString.GLOBAL.FAILED }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
