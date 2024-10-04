import { responseString } from '@/backend/helpers/serverResponseString'
import { checkTopUpTransactionStatus, getTopUpPaymentLink } from '@/backend/services/midtrans'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { createUserWalletHistory } from '@/backend/services/wallet-history'

import sqlz from '@/backend/configs/db'
import TransTopup from '@/backend/models/transtopup'
import User from '@/backend/models/user'

import '@/backend/models/association'

// ** Transaction > Top Up > Read One
export async function GET(request, response) {
  const { invoice } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek topup by invoice ada
  let currTopup = await TransTopup.findOne({
    where: { invoice }
    // include: {
    //   model: User,
    //   attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
    // }
  })
  if (!currTopup) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // * Ini untuk cek ke midtrans
  if (currTopup.status === 'pending') {
    let mt_transaction_id = currTopup.mt_transaction_id
    if (mt_transaction_id === null) {
      const getPaymentLink = await getTopUpPaymentLink(currTopup.invoice)
      console.log(getPaymentLink)
      if (!!getPaymentLink.purchases && !!getPaymentLink.purchases[0]) {
        currTopup.mt_transaction_id = getPaymentLink.purchases[0].transaction_id
        currTopup.mt_order_id = getPaymentLink.purchases[0].order_id
        mt_transaction_id = getPaymentLink.purchases[0].transaction_id
      }
    }

    if (!!mt_transaction_id) {
      console.log(mt_transaction_id)
      await checkTopUpTransactionStatus(mt_transaction_id).then(async ({ transaction_status, fraud_status }) => {
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
          const t = await sqlz.transaction()
          try {
            await User.increment('saldo', {
              by: currTopup.nominal,
              where: { id: currTopup.userRef },
              transaction: t
            })
            await createUserWalletHistory(
              t,
              currTopup.userRef,
              currTopup.nominal,
              'in',
              `Top Up Rp ${intlNumberFormat(currTopup.nominal, true)}`,
              `Top Up dengan invoice [${currTopup.invoice}]`
            )
            currTopup.status = 'success'
            await currTopup.save({ transaction: t })
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
          currTopup.status = 'failed'
          await currTopup.save()
        }
      })
    }
  }

  // Return data topup nya yang sudah di revalidate
  await currTopup.reload()
  res = { ...currTopup.dataValues }
  return Response.json(res, { status: 200 })
}

// ** Transaction > Top Up > Update (Payment Gateway)
export async function PUT(request, { params }) {
  const { invoice } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  return Response.json({ message: 'Transaction > Top Up > Update (Payment Gateway)', invoice, req })
}

// // ** Transaction > Top Up > Update Manual
// export async function PATCH(request, { params }) {
//   const { invoice } = params;
//   let req = {};
//   try { req = await request.json(); } catch (e) {}
//   let res = {};

//   return Response.json({message: "Transaction > Top Up > Update Manual", invoice, req})
// }

// ** Transaction > Top Up > Cancel
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
