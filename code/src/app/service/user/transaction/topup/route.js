import Joi from 'joi'
import dayjs from 'dayjs'
import { responseString } from '@/backend/helpers/serverResponseString'
import { checkTopUpTransactionStatus, createTopUpPaymentLink, getTopUpPaymentLink } from '@/backend/services/midtrans'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { createUserWalletHistory } from '@/backend/services/wallet-history'

import sqlz from '@/backend/configs/db'
import TransTopup from '@/backend/models/transtopup'
import User from '@/backend/models/user'

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
  let whereAttributes = { userRef: user.id }

  if (filterStatus === 'success' || filterStatus === 'pending' || filterStatus === 'failed') {
    whereAttributes = {
      ...whereAttributes,
      status: filterStatus
    }
  }

  return await TransTopup.findAll({
    where: whereAttributes,
    order: [['createdAt', 'DESC']]
  })
    .then(async resp => {
      for (let i = 0; i < resp.length; i++) {
        const tempData = resp[i]

        // * Ini untuk cek ke midtrans
        const dbUpdates = []
        if (tempData.status === 'pending') {
          let mt_transaction_id = tempData.mt_transaction_id
          let updateData = {}
          if (mt_transaction_id === null) {
            const getPaymentLink = await getTopUpPaymentLink(tempData.invoice)
            if (!!getPaymentLink.purchases && !!getPaymentLink.purchases[0]) {
              updateData = {
                ...updateData,
                mt_transaction_id: getPaymentLink.purchases[0].transaction_id,
                mt_order_id: getPaymentLink.purchases[0].order_id
              }
              mt_transaction_id = getPaymentLink.purchases[0].transaction_id
              dbUpdates.push('mt_transaction_id', 'mt_order_id')
            }
          }

          let newStatus = null
          if (!!mt_transaction_id) {
            await checkTopUpTransactionStatus(mt_transaction_id).then(async ({ transaction_status, fraud_status }) => {
              if (transaction_status === 'capture' || transaction_status === 'settlement') {
                const t = await sqlz.transaction()
                try {
                  await User.increment('saldo', {
                    by: tempData.nominal,
                    where: { id: tempData.userRef },
                    transaction: t
                  })
                  await createUserWalletHistory(
                    t,
                    tempData.userRef,
                    tempData.nominal,
                    'in',
                    `Top Up Rp ${intlNumberFormat(tempData.nominal, true)}`,
                    `Top Up dengan invoice [${tempData.invoice}]`
                  )
                  newStatus = 'success'
                  await t.commit()
                } catch (e) {
                  console.error('error di try catch transaction e', e)
                  await t.rollback()
                }
              } else if (
                transaction_status === 'deny' ||
                transaction_status === 'cancel' ||
                transaction_status === 'expire' ||
                transaction_status === 'refund' ||
                transaction_status === 'partial_refund'
              ) {
                newStatus = 'failed'
              }
              if (newStatus !== null) {
                updateData = { ...updateData, status: newStatus }
                dbUpdates.push('status')
              }
            })
          }

          if (Object.keys(updateData).length > 0)
            await TransTopup.update(updateData, { where: { id: tempData.id }, fields: dbUpdates })
        }

        transactions.push({ ...tempData?.dataValues })
      }

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
    // let tryCounter = 0
    // do {
    //   tryCounter++
    newId = `TT-${user.id}-${dayjs().format('YYYYMMYYHHmmss')}${Math.floor(Math.random() * 1000 + 1)}`
    let tempMidtransResponse = await createTopUpPaymentLink(
      newId,
      nominal,
      `${user.cUsername ?? user.displayName}`,
      user.email
    )
    // console.log(tryCounter, tempMidtransResponse)
    if (!!tempMidtransResponse && tempMidtransResponse.success) {
      newMidtransData = {
        paymentUrl: tempMidtransResponse.success.paymentUrl,
        transactionId: tempMidtransResponse.success.orderId
      }
    } else {
      res = { ...tempMidtransResponse?.error }
      return Response.json(res, { status: tempMidtransResponse?.error?.code ?? 400 })
    }
    //   if (tryCounter >= 20) throw new Error('limit breaker exceeded')
    // } while (!newMidtransData || tryCounter < TOTAL_MIDTRANS_RETRY)

    // ! Ga bisa karena klo blom bayar ga muncul datanya
    // // * Ambil Data Baru Dari Midtrans karena return aslinya tidak lengkap
    // let mt_transaction_id = null
    // let mt_order_id = null
    // const getPaymentLink = await getTopUpPaymentLink(newMidtransData.transactionId)
    // console.log('getPaymentLink', getPaymentLink)
    // if (!!getPaymentLink.purchases && !!getPaymentLink.purchases[0]) {
    //   mt_transaction_id = getPaymentLink.purchases[0].transaction_id
    //   mt_order_id = getPaymentLink.purchases[0].order_id
    // }

    // * Build Data
    let newTopUpData = TransTopup.build({
      userRef: user.id,
      invoice: newMidtransData.transactionId,
      nominal: Number(nominal),
      status: 'pending',
      mt_payment_link: newMidtransData.paymentUrl
      // mt_transaction_id,
      // mt_order_id
    })

    // * Insert to DB
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
        res = { error: { message: res.message, error }, serverMessage: responseString.GLOBAL.FAILED }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
