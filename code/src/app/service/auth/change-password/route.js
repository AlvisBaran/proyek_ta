import Joi from 'joi'
import bcrypt from 'bcrypt'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'

import '@/backend/models/association'

// ** Auth > Change Password
export async function PUT(request, response) {
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
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const currUser = await User.findByPk(user.id, {
      attributes: ['id', 'password']
    })

    let passMatch = false
    await bcrypt
      .compare(req.oldPassword, currUser.password)
      .then(res => {
        if (res) passMatch = true
      })
      .catch(err => {
        passMatch = false
      })

    if (passMatch) {
      currUser.password = await bcrypt.hash(req.newPassword, await bcrypt.genSalt(10)).then(hash => hash)
      await currUser.save()
      res = { message: responseString.USER.CHANGE_PASSWORD_SUCCESS }
      return Response.json(res, { status: 200 })
    } else {
      res = { message: 'Password lama tidak sesuai!' }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
