import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import Category from '@/backend/models/category'
import sqlz from '@/backend/configs/db'

// ** Admin > Category > Read One
export async function GET(request, response) {
  const { params } = response
  const { id } = params
  let res = {}

  // ** Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    id: Joi.number().required()
  }).validate(params, { abortEarly: false })

  if (!joiValidate.error) {
    // Cek user adalah admin
    let currUser = await User.findByPk(user.id)
    if (currUser.role !== 'admin') {
      res = { message: 'FORBIDDEN!\nAnda bukan admin!' }
      return Response.json(res, { status: 403 })
    }

    let currCategory = await Category.findByPk(id)
    if (!currCategory) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return Response.json({ ...currCategory.dataValues }, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Admin > Category > Update
export async function PUT(request, response) {
  const { params } = response
  const { id } = params
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

    let currCategory = await Category.findByPk(id)
    if (!currCategory) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const pervCategory = { ...currCategory.dataValues }

    currCategory.label = req.label

    return await currCategory
      .save({ fields: ['label'] })
      .then(resp => {
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...currCategory.dataValues
          },
          previousValues: pervCategory
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error }
        // throw new Error(res)
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Admin > Category > Delete
export async function DELETE(request, response) {
  const { params } = response
  const { id } = params
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

  // Cek user adalah admin
  let currUser = await User.findByPk(user.id)
  if (currUser.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 403 })
  }

  let currCategory = await Category.findByPk(id)
  if (!currCategory) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  } else {
    const t = await sqlz.transaction()

    try {
      currCategory.label = `${currCategory.label}-deleted-at-${new Date().toISOString()}`
      await currCategory.save({ transaction: t })
      await currCategory.destroy({ transaction: t })
      await t.commit()

      res = { message: responseString.GLOBAL.SUCCESS }
      return Response.json(res, { status: 200 })
    } catch (error) {
      res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error }
      return Response.json(res, { status: 400 })
    }
  }
  // return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
}
