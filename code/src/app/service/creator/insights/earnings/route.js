import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { range } from '@/utils/mathHelper'

import Membership from '@/backend/models/membership'
import UserMembershipPurchase from '@/backend/models/usermembershippurchase'
import ContentRequest from '@/backend/models/contentrequest'

import dayjs from 'dayjs'

const PARAMS = {
  model: ['this-month', 'this-year', 'last-5-year']
}

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const model = searchParams.get('model') ?? PARAMS.model[0]
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
    model: Joi.valid(...PARAMS.model).required()
  }).validate({ model }, { abortEarly: false })

  if (!joiValidate.error) {
    let startDate = null
    let endDate = new Date()
    if (model === 'this-month') {
      startDate = dayjs().startOf('month').toDate()
      endDate = dayjs().endOf('month').toDate()
    } else if (model === 'this-year') {
      startDate = dayjs().startOf('year').toDate()
      endDate = dayjs().endOf('year').toDate()
    } else if (model === 'last-5-year') {
      startDate = dayjs().subtract(4, 'year').startOf('year').toDate()
      endDate = dayjs().endOf('year').toDate()
    }

    // * Getting Memberhip Data
    const membershipIds = (await Membership.findAll({ where: { userRef: user.id }, attributes: ['id'] })).map(
      item => item.id
    )
    const resultsMembership = await UserMembershipPurchase.findAll({
      where: {
        membershipRef: membershipIds,
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: ['id', 'createdAt', 'grandTotal', 'userRef', 'membershipRef'],
      order: [['createdAt', 'DESC']]
    })

    // * Getting Content Request Data
    const resultsContentRequest = await ContentRequest.findAll({
      where: {
        creatorRef: user.id,
        status: 'done',
        updatedAt: { [Op.between]: [startDate, endDate] }
      },
      attributes: ['id', 'creatorRef', 'status', 'updatedAt', 'price'],
      order: [['updatedAt', 'DESC']]
    })

    let xAxis = []
    let xAxisLabel = undefined
    const membershipData = []
    const contentRequestData = []

    if (model === 'this-month') {
      // * Generating X Axis
      xAxis = range({ min: dayjs().startOf('month').date(), max: dayjs().endOf('month').date() + 1 })
      xAxisLabel = dayjs().format('MMMM')

      // * Bind Data to X Axis
      for (let i = 0; i < xAxis.length; i++) {
        const tempAxis = xAxis[i]
        // * Bind Membership Data
        const membershipBinding = resultsMembership.filter(item => dayjs(item.createdAt).date() === tempAxis)
        membershipData.push(membershipBinding.reduce((total, item) => total + Number(item.grandTotal), 0))
        // * Bind Content Request Data
        const contentRequestBinding = resultsContentRequest.filter(item => dayjs(item.updatedAt).date() === tempAxis)
        contentRequestData.push(contentRequestBinding.reduce((total, item) => total + Number(item.price), 0))
      }
    } else if (model === 'this-year') {
      // * Generating X Axis
      xAxis = range({ min: dayjs().startOf('year').month() + 1, max: dayjs().endOf('year').month() + 2 })
      xAxisLabel = dayjs().format('YYYY')

      // * Bind Data to X Axis
      for (let i = 0; i < xAxis.length; i++) {
        const tempAxis = xAxis[i]
        // * Bind Membership Data
        const membershipBinding = resultsMembership.filter(item => dayjs(item.createdAt).month() + 1 === tempAxis)
        membershipData.push(membershipBinding.reduce((total, item) => total + Number(item.grandTotal), 0))
        // * Bind Content Request Data
        const contentRequestBinding = resultsContentRequest.filter(
          item => dayjs(item.updatedAt).month() + 1 === tempAxis
        )
        contentRequestData.push(contentRequestBinding.reduce((total, item) => total + Number(item.price), 0))
      }

      xAxis = xAxis.map(item =>
        dayjs()
          .month(item - 1)
          .format('MMM')
      )
    } else if (model === 'last-5-year') {
      // * Generatin X Axis
      xAxis = range({ min: dayjs().subtract(4, 'year').year(), max: dayjs().year() + 1 })
      xAxisLabel = 'Years'

      // * Bind Data to X Axis
      for (let i = 0; i < xAxis.length; i++) {
        const tempAxis = xAxis[i]
        // * Bind Membership Data
        const membershipBinding = resultsMembership.filter(item => dayjs(item.createdAt).year() === tempAxis)
        membershipData.push(membershipBinding.reduce((total, item) => total + Number(item.grandTotal), 0))
        // * Bind Content Request Data
        const contentRequestBinding = resultsContentRequest.filter(item => dayjs(item.updatedAt).year() === tempAxis)
        contentRequestData.push(contentRequestBinding.reduce((total, item) => total + Number(item.price), 0))
      }
    }

    return Response.json(
      {
        xAxis: { data: xAxis, label: xAxisLabel },
        series: [
          { data: membershipData, label: 'Membership' },
          { data: contentRequestData, label: 'Content Request' }
        ]
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}