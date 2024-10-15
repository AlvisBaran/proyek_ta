import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'

const FILTERS = {
  order: ['create-date', 'title', 'most-like', 'most-share'],
  orderType: ['DESC', 'ASC'],
  publishStatus: ['draft-only', 'published-only'],
  type: ['public-only', 'private-only']
}

// ** Creator > Content > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const filterPublishStatus = searchParams.get('filterPublishStatus')
  const filterType = searchParams.get('filterType')
  const keyword = searchParams.get('keyword') ?? null
  let order = searchParams.get('order') ?? FILTERS.order[0]
  order = (order + '').toLowerCase()
  let orderType = searchParams.get('orderType') ?? FILTERS.orderType[0]
  orderType = (orderType + '').toUpperCase()
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
    filterPublishStatus: Joi.valid(...FILTERS.publishStatus)
      .allow(null)
      .optional(),
    filterType: Joi.valid(...FILTERS.type)
      .allow(null)
      .optional(),
    order: Joi.valid(...FILTERS.order).required(),
    orderType: Joi.valid(...FILTERS.orderType).required()
  }).validate(
    {
      filterPublishStatus,
      filterType,
      order,
      orderType
    },
    { abortEarly: false }
  )

  if (!joiValidate.error) {
    let whereAttributes = { creatorRef: user.id, contentRequestRef: null }
    if (!!keyword) {
      whereAttributes = {
        ...whereAttributes,
        [Op.or]: [
          { type: { [Op.iLike]: `%${keyword}%` } },
          { title: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } },
          { body: { [Op.iLike]: `%${keyword}%` } },
          { status: { [Op.iLike]: `%${keyword}%` } }
        ]
      }
    }

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
      .then(async (res = []) => {
        for (let i = 0; i < res.length; i++) {
          const tempData = res[i]
          // * Mengambil jumlah unique views
          const uniqueViews = (await ContentUniqueViews.count({ where: { contentRef: tempData.id } })) ?? 0

          contents.push({ ...tempData.dataValues, uniqueViews })
        }

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

// ** Creator > Content > Create
export async function POST(request, response) {
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
    type: Joi.valid('public', 'private').optional(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    const { type, title, body, description } = req

    let newContent = Content.build({
      creatorRef: user.id,
      type,
      title,
      body,
      description
    })

    // * Daftarkan content ke database
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
