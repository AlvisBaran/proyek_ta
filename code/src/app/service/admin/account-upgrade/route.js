import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'

import User from '@/backend/models/user'
import AccountUpgradeRequests from '@/backend/models/accountupgraderequests'

import '@/backend/models/association'

const FILTERS = {
  STATUS: ['requested', 'approved', 'declined']
}

// ** Admin > Account Upgrade > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword')
  const filterStatus = searchParams.get('filterStatus') ?? null
  let res = {}

  const joiValidate = Joi.object({
    filterStatus: Joi.valid(...FILTERS.STATUS)
      .valid(null)
      .optional()
  }).validate({ filterStatus }, { abortEarly: false })

  if (!joiValidate.error) {
    let requestsList = []
    let whereAttributes = {}
    if (!!keyword)
      whereAttributes = {
        ...whereAttributes,
        [Op.or]: [
          { newUsername: { [Op.like]: `%${keyword}%` } },
          { '$Applicant.displayName$': { [Op.like]: `%${keyword}%` } },
          { '$Applicant.email$': { [Op.like]: `%${keyword}%` } },
          { '$Applicant.cUsername$': { [Op.like]: `%${keyword}%` } },
          { '$Admin.displayName$': { [Op.like]: `%${keyword}%` } },
          { '$Admin.email$': { [Op.like]: `%${keyword}%` } },
          { '$Admin.cUsername$': { [Op.like]: `%${keyword}%` } }
        ]
      }
    if (!!filterStatus) whereAttributes = { ...whereAttributes, status: filterStatus }

    return await AccountUpgradeRequests.findAll({
      where: { ...whereAttributes },
      include: [
        {
          model: User,
          attributes: ['id', 'cUsername', 'displayName', 'email'],
          as: 'Applicant'
        },
        {
          model: User,
          attributes: ['id', 'cUsername', 'displayName', 'email'],
          as: 'Admin'
        }
      ],
      order: [['requestedAt', 'DESC']]
    })
      .then(async resps => {
        requestsList = resps.map(item => item.dataValues)
        return Response.json(requestsList, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, error: err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
