import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'

import '@/backend/models/association'
import { Op } from 'sequelize'

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

// ** Creator > Content Request > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') ?? null
  const keyword = searchParams.get('keyword') ?? null
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

  if (!joiValidate.error) {
    let contentRequests = []
    let where = {
      creatorRef: user.id
    }
    if (!!keyword)
      where = {
        ...where,
        [Op.or]: [
          { requestNote: { [Op.like]: `%${keyword}%` } },
          { status: { [Op.like]: `%${keyword}%` } },
          { '$ContentRequestor.displayName$': { [Op.like]: `%${keyword}%` } },
          { '$ContentRequestor.email$': { [Op.like]: `%${keyword}%` } }
        ]
      }
    if (!!status) where = { ...where, status: String(status).toLowerCase() }

    return await ContentRequest.findAll({
      where,
      include: [
        {
          model: User,
          as: 'ContentRequestor',
          attributes: ['id', 'cUsername', 'displayName', 'email']
        },
        {
          model: Content
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
