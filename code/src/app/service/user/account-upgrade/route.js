import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import AccountUpgradeRequests from '@/backend/models/accountupgraderequests'

// User > Account Upgrade > Request Become a Creator
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    id: Joi.number().required(),
    newUsername: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { id, newUsername } = req

    // Cek User Ada
    let currUser = await User.findByPk(id)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek Jika User bukan admin dan belum menjadi creator
    if (currUser.role == 'admin' || currUser.role == 'creator') {
      res = { message: 'User adalah seorang admin atau sudah menjadi creator!' }
      return Response.json(res, { status: 400 })
    }

    // Cek User Sudah Pernah Request
    let existItem = await AccountUpgradeRequests.findOne({ where: { applicantRef: id, status: 'requested' } })
    if (!!existItem) {
      res = { message: responseString.GLOBAL.ALREADY_EXISTS }
      return Response.json(res, { status: 400 })
    }

    // Insert Data
    let newItem = AccountUpgradeRequests.build({
      applicantRef: id,
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
