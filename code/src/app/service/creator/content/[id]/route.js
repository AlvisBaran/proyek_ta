import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'

// Creator > Content > Read One
export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const creatorId = searchParams.get('creatorId')
  const { id } = params
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    id: Joi.number().required()
  }).validate({ ...params, creatorId }, { abortEarly: false })

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: currCreator.id
      }
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

// Creator > Content > Update
export async function PUT(request, { params }) {
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    type: Joi.valid('public', 'private').allow(null).optional(),
    title: Joi.string().allow(null).optional(),
    body: Joi.string().allow(null).optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { creatorId, type, title, body } = req

    // Cek user ada
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek user adalah creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    // Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id,
        creatorRef: currCreator.id
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

// Creator > Content > Delete
export async function DELETE(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const creatorId = searchParams.get('creatorId')
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // Cek user ada
  let currCreator = await User.findByPk(creatorId)
  if (!currCreator) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek user adalah creator
  if (currCreator.role !== 'creator') {
    res = { message: 'Anda bukan seorang creator!' }
    return Response.json(res, { status: 403 })
  }

  // Cek content ada dan milik user yang sedang merequest
  let currContent = await Content.findOne({
    where: {
      id,
      creatorRef: currCreator.id
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
