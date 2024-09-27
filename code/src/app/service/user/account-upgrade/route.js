import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import AccountUpgradeRequests from '@/backend/models/accountupgraderequests'

// ** User > Account Upgrade > Get Self
export async function GET(request, response) {
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const results = await AccountUpgradeRequests.findAll({
    where: { applicantRef: user.id },
    order: [['requestedAt', 'DESC']]
  })

  return Response.json(results, { status: 200 })
}

// ** User > Account Upgrade > Request Become a Creator
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
    newUsername: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { newUsername } = req

    // * Cek Username Kembar
    let existing = await User.findOne({ where: { cUsername: newUsername }, paranoid: false })
    if (!!existing) {
      res = { message: 'Username sudah terpakai!' }
      return Response.json(res, { status: 400 })
    }

    // * Cek Jika User bukan admin dan belum menjadi creator
    if (user.role == 'admin' || user.role == 'creator') {
      res = { message: 'User adalah seorang admin atau sudah menjadi creator!' }
      return Response.json(res, { status: 400 })
    }

    // * Cek User Sudah Pernah Request
    let existItem = await AccountUpgradeRequests.findOne({ where: { applicantRef: user.id, status: 'requested' } })
    if (!!existItem) {
      res = { message: responseString.GLOBAL.ALREADY_EXISTS }
      return Response.json(res, { status: 400 })
    }

    // * Insert Data
    let newItem = AccountUpgradeRequests.build({
      applicantRef: user.id,
      newUsername
    })

    return await newItem
      .save()
      .then(async resp => {
        await newItem.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...newItem.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
