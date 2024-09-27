import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import TransWithdraw from '@/backend/models/transwithdraw'
import User from '@/backend/models/user'
import Bank from '@/backend/models/bank'

import '@/backend/models/association'

// ** Admin > Request Withdraw > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  const filterStatus = searchParams.get('filterStatus') ?? null
  const filterUser = !!searchParams.get('filterUser') ? Number(searchParams.get('filterUser')) : null
  let res = {}

  const joiValidate = Joi.object({
    filterStatus: Joi.valid('on-hold', 'approved', 'declined').valid(null)
  }).validate({ filterStatus }, { abortEarly: false })

  if (!joiValidate.error) {
    // ** Cek user ada
    const { user, error } = await getUserFromServerSession(request, response)
    if (!!error) {
      res = { message: error.message }
      return Response.json(res, { status: error.code })
    }

    // * Cek user is admin
    if (user.role !== 'admin') {
      res = { message: responseString.USER.NOT_ADMIN }
      return Response.json(res, { status: 400 })
    }

    let where = {}

    if (!!keyword)
      where = {
        ...where,
        [Op.or]: [
          { nomorRekening: { [Op.like]: `%${keyword}%` } },
          { status: { [Op.like]: `%${keyword}%` } },
          { note: { [Op.like]: `%${keyword}%` } },
          { '$User.displayName$': { [Op.like]: `%${keyword}%` } },
          { '$User.cUsername$': { [Op.like]: `%${keyword}%` } },
          { '$Bank.name$': { [Op.like]: `%${keyword}%` } },
          { '$Bank.alias$': { [Op.like]: `%${keyword}%` } },
          { '$Bank.swiftCode$': { [Op.like]: `%${keyword}%` } }
        ]
      }

    if (!!filterStatus) {
      where = { ...where, status: filterStatus }
    }
    if (!!filterUser && !isNaN(filterUser)) {
      where = { ...where, userRef: filterUser }
    }

    const withdraws = await TransWithdraw.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'cUsername', 'email', 'displayName']
        },
        {
          model: Bank
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return Response.json(withdraws, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
