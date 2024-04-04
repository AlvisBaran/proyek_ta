import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'

const FILTERS = {
  order: ['create-date', 'title', 'most-like', 'most-share'],
  orderType: ['DESC', 'ASC'],
  publishStatus: ['draft-only', 'published-only'],
  type: ['public-only', 'private-only']
}

// Creator > Content > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const creatorId = searchParams.get('creatorId')
  const filterPublishStatus = searchParams.get('filterPublishStatus')
  const filterType = searchParams.get('filterType')
  const search = searchParams.get('search')
  let order = searchParams.get('order') ?? FILTERS.order[0]
  order = (order + '').toLowerCase()
  let orderType = searchParams.get('orderType') ?? FILTERS.orderType[0]
  orderType = (orderType + '').toUpperCase()
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    filterPublishStatus: Joi.valid(...FILTERS.publishStatus)
      .allow(null)
      .optional(),
    filterType: Joi.valid(...FILTERS.type)
      .allow(null)
      .optional(),
    search: Joi.string().allow(null).optional(),
    order: Joi.valid(...FILTERS.order).required(),
    orderType: Joi.valid(...FILTERS.orderType).required()
  }).validate(
    {
      creatorId,
      filterPublishStatus,
      filterType,
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

    let whereAttributes = { creatorRef: creatorId }
    let contents = []

    if (!!filterPublishStatus) {
      if (filterPublishStatus === 'draft-only') {
        whereAttributes = {
          ...whereAttributes,
          status: 'draft'
        }
      } else if (filterPublishStatus === 'published-only') {
        whereAttributes = {
          ...whereAttributes,
          status: 'published'
        }
      }
    }
    if (!!filterType) {
      if (filterType === 'public-only') {
        whereAttributes = {
          ...whereAttributes,
          type: 'public'
        }
      } else if (filterType === 'private-only') {
        whereAttributes = {
          ...whereAttributes,
          type: 'private'
        }
      }
    }

    // This is a function that instantly called and gets the result
    const orderFilter = (function () {
      if (order === 'create-date') return 'createdAt'
      else if (order === 'title') return 'title'
      else if (order === 'most-like') return 'likeCounter'
      else if (order === 'most-share') return 'shareCounter'
      else return 'createdAt'
    })()

    return await Content.findAll({
      where: { ...whereAttributes },
      order: [[orderFilter, orderType]]
    })
      .then((res = []) => {
        res?.map(datum =>
          contents.push({
            ...datum?.dataValues
          })
        )

        return Response.json(contents, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// Creator > Content > Create
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    type: Joi.valid('public', 'private').optional(),
    title: Joi.string().required(),
    body: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { creatorId, type, title, body } = req

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

    let newContent = Content.build({
      creatorRef: creatorId,
      type,
      title,
      body
    })

    // Daftarkan content ke database
    return await newContent
      .save()
      .then(async resp => {
        await newContent.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newContent.dataValues
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
