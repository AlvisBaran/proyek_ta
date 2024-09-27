import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'
import Category from '@/backend/models/category'
import Membership from '@/backend/models/membership'

import '@/backend/models/association'

// ** Creator > Content > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek user adalah creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 403 })
  }

  const joiValidate = Joi.object({
    id: Joi.number().required()
  }).validate({ id }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: user.id
      },
      include: [{ model: Membership }, { model: Category }]
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    return Response.json(
      {
        ...currContent.dataValues
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Content > Update
export async function PUT(request, response) {
  const { id } = response.params
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

  // * Cek user adalah creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 403 })
  }

  const joiValidate = Joi.object({
    type: Joi.valid('public', 'private').allow(null).optional(),
    title: Joi.string().allow(null).optional(),
    description: Joi.string().allow(null).optional(),
    body: Joi.string().allow(null).optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { type, title, body, description } = req

    // * Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: user.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    let oldDataValues = { ...currContent.dataValues }
    let changingAttributes = []

    if (type !== undefined) {
      currContent.type = type
      changingAttributes.push('type')
    }
    if (title !== undefined) {
      currContent.title = title
      changingAttributes.push('title')
    }
    if (body !== undefined) {
      currContent.body = body
      changingAttributes.push('body')
    }
    if (description !== undefined) {
      currContent.description = description
      changingAttributes.push('description')
    }

    if (changingAttributes.length <= 0) {
      res = { message: responseString.VALIDATION.NOTHING_CHANGE_ON_UPDATE }
      return Response.json(res, { status: 400 })
    } else {
      currContent.status = 'draft'
      changingAttributes.push('status')
    }

    return await currContent
      .save({ fields: [...changingAttributes] })
      .then(async resp => {
        await currContent.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...currContent.dataValues
          },
          previousValues: {
            ...oldDataValues
          }
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

// ** Creator > Content > Delete
export async function DELETE(request, response) {
  const { id } = response.params
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

  // * Cek user adalah creator
  if (user.role !== 'creator') {
    res = { message: responseString.USER.NOT_CREATOR }
    return Response.json(res, { status: 403 })
  }

  // * Cek content ada dan milik user yang sedang merequest
  let currContent = await Content.findOne({
    where: {
      id,
      creatorRef: user.id
    }
  })
  if (!currContent) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  return await currContent
    .destroy()
    .then(resp => {
      res = { message: responseString.GLOBAL.SUCCESS }
      return Response.json(res, { status: 200 })
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error }
      return Response.json(res, { status: 400 })
    })
}
