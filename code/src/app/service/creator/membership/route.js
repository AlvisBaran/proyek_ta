import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'

const FILTERS = {
  order: ['create-date', 'name'],
  orderType: ['DESC', 'ASC']
}

// Creator > Membership > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const creatorId = searchParams.get('creatorId')
  const search = searchParams.get('search')
  let order = searchParams.get('order') ?? FILTERS.order[0]
  order = (order + '').toLowerCase()
  let orderType = searchParams.get('orderType') ?? FILTERS.orderType[0]
  orderType = (orderType + '').toUpperCase()
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    search: Joi.string().allow(null).optional(),
    order: Joi.valid(...FILTERS.order).required(),
    orderType: Joi.valid(...FILTERS.orderType).required()
  }).validate(
    {
      creatorId,
      search,
      order,
      orderType
    },
    { abortEarly: false }
  )

  if (!joiValidate.error) {
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // This is a function that instantly called and gets the result
    const orderFilter = (function () {
      if (order === 'create-date') return 'createdAt'
      else if (order === 'name') return 'name'
      else return 'createdAt'
    })()

    let whereAttributes = { userRef: creatorId }
    let memberships = []

    return await Membership.findAll({
      where: { ...whereAttributes },
      order: [[orderFilter, orderType]]
    })
      .then((res = []) => {
        res?.map(datum =>
          memberships.push({
            ...datum?.dataValues
          })
        )

        return Response.json(memberships, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// Creator > Membership > Create
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    name: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { creatorId, name, slug, description, price } = req

    // Cek user ada
    let currCreator = await User.findByPk(creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek user adalah creator (sebenernya bisa bareng di atas, tapi ya sudah pisah aja)
    if (currCreator.role !== 'creator') {
      res = { message: 'Anda bukan seorang creator!' }
      return Response.json(res, { status: 403 })
    }

    let newMembership = Membership.build({
      userRef: creatorId,
      name,
      slug,
      description,
      price
    })

    // Daftarkan Membership ke database
    return await newMembership
      .save()
      .then(async resp => {
        await newMembership.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newMembership.dataValues
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
