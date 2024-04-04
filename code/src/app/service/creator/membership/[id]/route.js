import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'

// Creator > Membership > Read One
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

    // Cek Membership ada dan milik user yang sedang merequest
    let currContent = await Membership.findOne({
      where: {
        id,
        userRef: currCreator.id
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

// Creator > Membership > Update
export async function PUT(request, { params }) {
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    name: Joi.string().allow(null).optional(),
    slug: Joi.string().allow(null).optional(),
    description: Joi.string().allow(null).optional(),
    price: Joi.number().allow(null).optional()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { creatorId, name, slug, description, price } = req

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

    // Cek Membership ada dan milik user yang sedang merequest
    let currContent = await Membership.findOne({
      where: {
        id,
        userRef: currCreator.id
      }
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    let oldDataValues = { ...currContent.dataValues }
    let changingAttributes = []

    if (name !== undefined) {
      currContent.name = name
      changingAttributes.push('name')
    }
    if (slug !== undefined) {
      currContent.slug = slug
      changingAttributes.push('slug')
    }
    if (description !== undefined) {
      currContent.description = description
      changingAttributes.push('description')
    }
    if (price !== undefined) {
      currContent.price = price
      changingAttributes.push('price')
    }

    if (changingAttributes.length <= 0) {
      res = { message: responseString.VALIDATION.NOTHING_CHANGE_ON_UPDATE }
      return Response.json(res, { status: 400 })
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

// Creator > Membership > Delete
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

  // Cek Membership ada dan milik user yang sedang merequest
  let currContent = await Membership.findOne({
    where: {
      id,
      userRef: currCreator.id
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
