import sqlz from '@/backend/configs/db'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { createUserWalletHistory } from '@/backend/services/wallet-history'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import ContentRequestPayment from '@/backend/models/contentrequestpayment'

import '@/backend/models/association'

// ** User > Content Request > Payment > Delete Payment
export async function DELETE(request, response) {
  const { id, paymentId } = response.params
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
    return Response.json(res, { status: 400 })
  }

  // * Cek payment ada
  const currPayment = await ContentRequestPayment.findOne({ where: { id: paymentId } })
  if (!currPayment) {
    res = { message: 'Payment tidak ditemukan!' }
    return Response.json(res, { status: 404 })
  }

  // * Cek User adalah pemilik content request atau pelaku payment
  if (currContentRequest.applicantRef !== user.id) {
    if (currPayment.userRef !== user.id) {
      res = { message: 'User bukan pemilik content request maupun pemilik payment!' }
      return Response.json(res, { status: 400 })
    }
  }

  // * Get Pemilik Payment
  const paymentOwner = await User.findOne({ where: { id: currPayment.userRef } })

  const t = await sqlz.transaction()

  try {
    await paymentOwner.increment('saldo', { by: Number(currPayment.nominal), transaction: t })
    await createUserWalletHistory(
      t,
      paymentOwner.id,
      Number(currPayment.nominal),
      'in',
      'Pengembalian Dana Request Content',
      `Request Content dengan ID [${currContentRequest.id}]`
    )
    await currContentRequest.increment('leftoverPrice', { by: Number(currPayment.nominal), transaction: t })
    await currPayment.destroy({ transaction: t })

    await t.commit()
  } catch (err) {
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

  // ** Return Response
  return Response.json(
    {
      message: 'Pembayaran berhasil dibatalkan!'
    },
    { status: 200 }
  )
}
