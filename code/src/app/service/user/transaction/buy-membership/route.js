import Joi from 'joi'
import dayjs from 'dayjs'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { createUserWalletHistory } from '@/backend/services/wallet-history'
import { mainBucketName, minioClient } from '@/minio/config'

import sqlz from '@/backend/configs/db'
import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'

import '@/backend/models/association'

// ** Transaction > Buy Membership > Read All
export async function GET(request, response) {
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const results = await UserMembershipPurchase.findAll({
    where: { userRef: user.id },
    include: {
      model: Membership,
      include: {
        model: User,
        attributes: ['id', 'cUsername', 'displayName', 'profilePicture']
      }
    },
    order: [['createdAt', 'DESC']]
  })

  const memberships = []

  for (let i = 0; i < results.length; i++) {
    const tempData = results[i]
    let profilePictureUrl = null
    if (!!tempData.Membership && !!tempData.Membership.User && !!tempData.Membership.User.profilePicture) {
      // ** Mengambil setiap url dari object yang bersangkutan
      await minioClient
        .presignedGetObject(mainBucketName, tempData.Membership.User.profilePicture)
        .then(url => {
          profilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    memberships.push({
      ...tempData.dataValues,
      Membership: {
        ...tempData.Membership.dataValues,
        User: {
          ...tempData.Membership.User.dataValues,
          profilePictureUrl
        }
      }
    })
  }

  return Response.json(memberships, { status: 200 })
}

// ** Transaction > Buy Membership > Buy Membership
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
    membershipId: Joi.number().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Ambil Data User
    const currUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'saldo', 'cUsername', 'displayName']
    })
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Membership Ada
    const currMembership = await Membership.findByPk(Number(req.membershipId))
    if (!currMembership) {
      res = { message: responseString.MEMBERSHIP.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Saldo Cukup
    if (Number(currUser.saldo) < Number(currMembership.price)) {
      res = { message: responseString.USER.INUFICENT_BALANCE }
      return Response.json(res, { status: 400 })
    }

    // * Build Data
    const expiredAt = dayjs().add(Number(currMembership.interval), 'day').toDate()
    const newPurchase = UserMembershipPurchase.build({
      userRef: Number(user.id),
      membershipRef: Number(currMembership.id),
      grandTotal: currMembership.price,
      expiredAt
    })

    // * Insert DB
    const t = await sqlz.transaction()
    const PERSENTASE_ADMIN = 3
    const BIAYA_ADMIN = Math.floor((Number(currMembership.price) * PERSENTASE_ADMIN) / 100)

    try {
      // * Tarik uang dari user
      await currUser.decrement('saldo', { by: Number(currMembership.price), transaction: t })
      await newPurchase.save({ transaction: t })
      await createUserWalletHistory(
        t,
        currUser.id,
        Number(currMembership.price),
        'out',
        'Bayar Membership',
        `Membership dengan nama [${currMembership.name}] expired pada ${expiredAt.toISOString()}`
      )

      // * Add Saldo and Wallet History ke Creator
      const currCreator = await User.findByPk(currMembership.userRef)
      if (!!currCreator) {
        const incomeCreator = Number(currMembership.price) - BIAYA_ADMIN
        currCreator.increment('saldo', { by: incomeCreator, transaction: t })
        await createUserWalletHistory(
          t,
          currCreator.id,
          incomeCreator,
          'in',
          'Pemasukan Membership',
          `Membership dengan nama [${currMembership.name}] oleh ${currUser.displayName}`
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
          'Pemasukan Membership',
          `Membership dengan nama [${currMembership.name}] dari Creator dengan username [${currCreator.cUsername}] oleh ${currUser.displayName}`
        )
      }

      await t.commit()

      return Response.json({ message: responseString.GLOBAL.SUCCESS }, { status: 200 })
    } catch (e) {
      await t.rollback()
      res = { message: responseString.GLOBAL.FAILED, error: e }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
