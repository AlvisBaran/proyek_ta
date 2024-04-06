import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import Category from '@/backend/models/category'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import User from '@/backend/models/user'

// ** Admin > Category > Read All
export async function GET() {
  let categories = []
  return await Category.findAll({ order: [['createdAt', 'DESC']] })
    .then((resp = []) => {
      resp?.map(datum => categories.push({ ...datum?.dataValues }))

      return Response.json(categories, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
    })
}

// ** Admin > Category > Create
export async function POST(request, response) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // TODO:: Validasi input
  const joiValidate = Joi.object({
    label: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // Cek user adalah admin
    let currUser = await User.findByPk(user.id)
    if (currUser.role !== 'admin') {
      res = { message: 'FORBIDDEN!\nAnda bukan admin!' }
      return Response.json(res, { status: 403 })
    }

    let newCategory = Category.build({ ...req })

    // TODO:: Cek category terdaftar di database
    let categorySnapshot = await Category.findOne({ where: { label: req.label } })

    if (!!categorySnapshot) {
      res = { error: { label: responseString.GLOBAL.ALREADY_EXISTS } }
      return Response.json(res, { status: 400 })
    }

    // TODO:: Daftarkan category ke database
    return await newCategory
      .save()
      .then(async resp => {
        await newCategory.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newCategory.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}