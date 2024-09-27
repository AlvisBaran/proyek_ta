import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'

import '@/backend/models/association'

const FILTERS = {
  METHOD: ['id-only', 'full']
}

// ** User > Manage Account > List Membership
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const method = searchParams.get('method') ?? 'full'
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    method: Joi.valid(...FILTERS.METHOD).required()
  }).validate({ method }, { abortEarly: false })

  if (!joiValidate.error) {
    if (method === 'id-only') {
      const currData = await UserMembershipPurchase.findAll({
        where: { userRef: user.id, expiredAt: { [Op.gt]: new Date() } },
        attributes: ['id'],
        order: [['createdAt', 'DESC']]
      })

      return Response.json(
        currData.map(item => item.id),
        { status: 200 }
      )
    } else if (method === 'full') {
      const currData = await UserMembershipPurchase.findAll({
        where: { userRef: user.id, expiredAt: { [Op.gt]: new Date() } },
        include: {
          model: Membership,
          include: {
            model: User,
            attributes: ['id', 'cUsername', 'displayName']
          }
        },
        order: [['createdAt', 'DESC']]
      })

      return Response.json(currData, { status: 200 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
