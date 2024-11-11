import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'

import dayjs from 'dayjs'

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  let dateStart = searchParams.get('dateStart') ?? null
  if (!!dateStart) dateStart = new Date(dateStart)
  let dateEnd = searchParams.get('dateEnd') ?? null
  if (!!dateEnd) dateEnd = new Date(dateEnd)
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
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required()
  }).validate({ dateStart, dateEnd }, { abortEarly: false })

  if (!joiValidate.error) {
    const startDate = dayjs(dateStart)
    const endDate = dayjs(dateEnd).add(1, 'day')

    // * Getting Memberhip Data
    const membershipIds = (await Membership.findAll({ where: { userRef: user.id }, attributes: ['id'] })).map(
      item => item.id
    )
    const resultsMembership = await UserMembershipPurchase.findAll({
      where: {
        membershipRef: membershipIds,
        createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
        expiredAt: { [Op.gt]: new Date() }
      },
      attributes: ['id', 'createdAt', 'expiredAt', 'userRef', 'membershipRef'],
      order: [['createdAt', 'DESC']]
    })

    let xAxis = []
    let xAxisLabel = undefined
    const membershipData = []

    const dateRange = endDate.diff(startDate, 'day')
    for (let i = 0; i < dateRange; i++) {
      const dateNow = startDate.add(i, 'day')
      // * Formatting X Axis
      xAxis.push(dateNow.format('D MMM'))
      // * Bind Membership Data
      const membershipBinding = resultsMembership.filter(item => {
        const createdAt = dayjs(item.createdAt)
        return (
          createdAt.date() === dateNow.date() &&
          createdAt.month() === dateNow.month() &&
          createdAt.year() === dateNow.year()
        )
      })
      membershipData.push(membershipBinding.length)
    }

    return Response.json(
      {
        xAxis: { data: xAxis, label: xAxisLabel },
        series: [{ data: membershipData, label: 'Upgraded to paid' }]
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
