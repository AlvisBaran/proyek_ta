import Joi from 'joi'
import dayjs from 'dayjs'
import { v4 as UUIDV4 } from 'uuid'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { range } from '@/utils/mathHelper'
import { PERSENTASE_ADMIN } from '@/utils/constants'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'
import ContentRequest from '@/backend/models/contentrequest'

export const dynamic = 'force-dynamic'

// ** Creator > Insights > Earnings > Summary
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  let year = searchParams.get('year') ?? dayjs().year()
  year = +year
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
    year: Joi.date().required()
  }).validate({ year }, { abortEarly: false })

  if (!joiValidate.error) {
    const currDate = new Date(year, 0)
    let startDate = dayjs(currDate).startOf('year')
    let endDate = dayjs(currDate).endOf('year')

    // * Getting Memberhip Data
    const membershipIds = (await Membership.findAll({ where: { userRef: user.id }, attributes: ['id'] })).map(
      item => item.id
    )
    const resultsMembership = await UserMembershipPurchase.findAll({
      where: {
        membershipRef: membershipIds,
        createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] }
      },
      attributes: ['id', 'createdAt', 'grandTotal', 'userRef', 'membershipRef'],
      order: [['createdAt', 'DESC']]
    })

    // * Getting Content Request Data
    const resultsContentRequest = await ContentRequest.findAll({
      where: {
        creatorRef: user.id,
        status: 'done',
        updatedAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] }
      },
      attributes: ['id', 'creatorRef', 'status', 'updatedAt', 'price'],
      order: [['updatedAt', 'DESC']]
    })

    const results = []

    let months = range({ min: startDate.month(), max: endDate.month() + 1 })
    for (let i = 0; i < months.length; i++) {
      const tempMonth = months[i]
      const membershipBinding = resultsMembership.filter(item => dayjs(item.createdAt).month() === tempMonth)
      const contentRequestBinding = resultsContentRequest.filter(item => dayjs(item.updatedAt).month() === tempMonth)
      const grandTotal =
        membershipBinding.reduce((total, item) => total + Number(item.grandTotal), 0) +
        contentRequestBinding.reduce((total, item) => total + Number(item.price), 0)
      const adminEarning = Math.floor((Number(grandTotal) * PERSENTASE_ADMIN) / 100)
      const creatorEarning = grandTotal - adminEarning

      results.push({
        id: `${tempMonth}-${UUIDV4()}`,
        month: dayjs().month(tempMonth).format('MMMM'),
        grandTotal,
        adminEarning,
        creatorEarning
      })
    }

    return Response.json(results, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
