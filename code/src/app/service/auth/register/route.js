import Joi from 'joi'
import bcrypt from 'bcrypt'
import { responseString } from '@/backend/helpers/serverResponseString'

import User from '@/backend/models/user'

// ** Auth > Register
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // * Validasi input
  const joiValidate = Joi.object({
    role: Joi.valid('normal', 'creator', 'admin').optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required(),
    // .label('confirmPassword').message({ 'any.only': '{{#label}} does not match' }),
    displayName: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    let newUser = User.build({
      role: req.role,
      email: req.email,
      password: await bcrypt.hash(req.password, await bcrypt.genSalt(10)).then(hash => hash),
      displayName: req.displayName
    })

    // * Cek user terdaftar di database
    let userSnapshot = await User.findOne({ where: { email: newUser.email } })

    if (!!userSnapshot) {
      res = { error: { email: responseString.USER.EMAIL_USED } }
      return Response.json(res, { status: 400 })
    }

    // * Daftarkan user ke database
    return await newUser
      .save()
      .then(async resp => {
        await newUser.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newUser.dataValues
            // joinDate: undefined,
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.USER.ADD_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
