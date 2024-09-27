import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import User from '@/backend/models/user'
import UsersWalletHistory from '@/backend/models/userswallethistory'

import '@/backend/models/association'

const FILTERS = {
  historyType: ['in', 'out']
}

// ** User > Wallet History > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const historyType = searchParams.get('historyType') ?? null
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    historyType: Joi.valid(...FILTERS.historyType)
      .allow(null)
      .optional()
  }).validate({ historyType }, { abortEarly: false })

  if (!joiValidate.error) {
    let contentRequests = []
    let where = {
      userRef: user.id
    }
    if (!!historyType) where = { ...where, type: String(historyType).toLowerCase() }

    return await UsersWalletHistory.findAll({
      where,
      order: [['createdAt', 'DESC']]
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
