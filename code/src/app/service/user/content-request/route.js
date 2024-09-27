import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'
import ContentRequestMember from '@/backend/models/contentrequestmember'

import '@/backend/models/association'

const FILTERS = {
  status: [
    'requested',
    'on-progress',
    'waiting-requestor-confirmation',
    'waiting-payment',
    'waiting-creator-confirmation',
    'done'
  ]
}

// ** User > Content Request > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') ?? null
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    status: Joi.valid(...FILTERS.status)
      .allow(null)
      .optional()
  }).validate({ status }, { abortEarly: false })

  // const asd = await ContentRequestMember.findAll({ where: { userRef: 2 } })

  // return Response.json(asd)

  if (!joiValidate.error) {
    let contentRequests = []
    let where = {
      [Op.or]: [{ applicantRef: user.id }, { '$ContentRequestMembers.userRef$': user.id }]
    }
    if (!!status) where = { ...where, status: String(status).toLowerCase() }

    return await ContentRequest.findAll({
      where,
      include: [
        {
          model: User,
          as: 'ContentCreator',
          attributes: ['id', 'cUsername', 'displayName', 'profilePicture']
        },
        {
          model: Content
        },
        {
          model: ContentRequestMember,
          attributes: ['id', 'userRef']
          // include: { model: User, attributes: ['id', 'cUsername', 'displayName', 'profilePicture'] }
        }
      ],
      order: [['updatedAt', 'DESC']]
    })
      .then(async (resp = []) => {
        for (let i = 0; i < resp.length; i++) {
          const datum = resp[i]
          contentRequests.push(datum)
        }
        return Response.json(contentRequests, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** User > Content Request > Create
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

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    requestNote: Joi.string().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek creator ada
    let currCreator = await User.findByPk(req.creatorId)
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek creator beneran creator
    if (currCreator.role !== 'creator') {
      res = { message: 'Creator tidak ditemukan!' }
      return Response.json(res, { status: 403 })
    }

    // * Build Item
    const newContentRequest = ContentRequest.build({
      creatorRef: currCreator.id,
      applicantRef: user.id,
      requestNote: req.requestNote
    })

    // * Insert DB
    return await newContentRequest
      .save()
      .then(async () => {
        await newContentRequest.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newContentRequest.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
