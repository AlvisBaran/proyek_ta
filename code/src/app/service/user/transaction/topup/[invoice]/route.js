import TransTopup from '@/backend/models/transtopup'
import User from '@/backend/models/user'

import { responseString } from '@/backend/helpers/serverResponseString'

import '@/backend/models/association'
import { checkTopUpTransactionStatus, getTopUpPaymentLink } from '@/backend/services/midtrans'

// Transaction > Top Up > Read One
export async function GET(request, { params }) {
  const { invoice } = params
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let res = {}

  // Cek user ada
  let currUser = await User.findByPk(userId)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek topup by invoice ada
  let currTopup = await TransTopup.findOne({
    where: { invoice },
    include: {
      model: User,
      attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
    }
  })
  if (!currTopup) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // ! Ga jadi dipake
  // // Cek invoice milik user nya
  // if (currUser.id !== currTopup.userRef) {
  //   res = { message: responseString.GLOBAL.NOT_FOUND };
  //   return Response.json(res, { status: 404 });
  // }

  // Get Data Transaction from Midtrans
  if (process.env.NODE_ENV !== 'production') {
    // * Bagian ini tidak terjadi di server
    const getPaymentLink = await getTopUpPaymentLink(invoice)
    if (!!getPaymentLink.purchases && !!getPaymentLink.purchases[0]) {
      currTopup.mt_transaction_id = getPaymentLink.purchases[0].transaction_id
      currTopup.mt_order_id = getPaymentLink.purchases[0].order_id
    }
    await currTopup.save()
  }

  // Get Status ke Midtrans dan Update database (Sama dengan webhook di bawah)
  await checkTopUpTransactionStatus(currTopup.mt_transaction_id).then(async ({ transaction_status, fraud_status }) => {
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (currTopup.status === 'pending') {
        await User.increment('saldo', { by: currTopup.nominal, where: { id: currTopup.userRef } })
      }
      currTopup.status = 'success'
    } else if (transaction_status === 'pending') {
      currTopup.status = 'pending'
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire' ||
      transaction_status === 'refund' ||
      transaction_status === 'partial_refund'
    ) {
      currTopup.status = 'failed'
    }
    await currTopup.save()
  })

  // Return data topup nya yang sudah di revalidate
  await currTopup.reload()
  res = { ...currTopup.dataValues }
  return Response.json(res, { status: 200 })
}

// Transaction > Top Up > Update (Payment Gateway)
export async function PUT(request, { params }) {
  const { invoice } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  return Response.json({ message: 'Transaction > Top Up > Update (Payment Gateway)', invoice, req })
}

// // Transaction > Top Up > Update Manual
// export async function PATCH(request, { params }) {
//   const { invoice } = params;
//   let req = {};
//   try { req = await request.json(); } catch (e) {}
//   let res = {};

//   return Response.json({message: "Transaction > Top Up > Update Manual", invoice, req})
// }

// Transaction > Top Up > Cancel
export async function DELETE(request, { params }) {
  const { invoice } = params
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // Cek user ada
  let currUser = await User.findByPk(userId)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek topup by invoice ada
  let currTopup = await TransTopup.findOne({ where: { invoice } })
  if (!currTopup) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek invoice milik user nya
  if (currUser.id !== currTopup.userRef) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // TODO: Cancel ke midtrans

  if (currTopup.status === 'pending') {
    // Update status database
    currTopup.status = 'failed'
    await currTopup.save()
    await currTopup.reload()
    res = {
      message: responseString.GLOBAL.SUCCESS,
      previousValues: { ...currTopup.dataValues }
    }

    return Response.json(res, { status: 200 })
  } else {
    res = {
      message: 'Aksi tidak valid, tidak dapat merubah status!'
    }
    return Response.json(res, { status: 400 })
  }
}
