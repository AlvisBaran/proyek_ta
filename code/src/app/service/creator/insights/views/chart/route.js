import Joi from 'joi'
import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { range } from '@/utils/mathHelper'

import Content from '@/backend/models/content'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'
import ContentShares from '@/backend/models/contentshares'
import ContentLikes from '@/backend/models/contentlikes'

import dayjs from 'dayjs'

const PARAMS = {
  model: ['this-month', 'this-year', 'last-5-year']
}

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const model = searchParams.get('model') ?? PARAMS.model[0]
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

    // * Getting Creator's Contents Id
    const contents = await Content.findAll({
      where: { creatorRef: user.id, contentRequestRef: null },
      attributes: ['id', 'publishedAt']
    })
    const contentIds = contents.map(item => item.id)

    // * Getting Views Data
    const resultsViews = await ContentUniqueViews.findAll({
      where: {
        contentRef: contentIds,
        createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] }
      },
      order: [['createdAt', 'DESC']]
    })

    // * Getting Shares Data
    const resultsShares = await ContentShares.findAll({
      where: {
        contentRef: contentIds,
        createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] }
      },
      order: [['createdAt', 'DESC']]
    })

    // * Getting Likes Data
    const resultsLikes = await ContentLikes.findAll({
      where: {
        contentRef: contentIds,
        createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] }
      },
      order: [['createdAt', 'DESC']]
    })

    let xAxis = []
    let xAxisLabel = undefined
    const viewsData = []
    const sharesData = []
    const likesData = []
    const contentsData = []

    const dateRange = endDate.diff(startDate, 'day')
    for (let i = 0; i < dateRange; i++) {
      const dateNow = startDate.add(i, 'day')
      // * Formatting X Axis
      xAxis.push(dateNow.format('D MMM'))
      // * Add Views Data
      const viewsBinding = resultsViews.filter(item => {
        const createdAt = dayjs(item.createdAt)
        return (
          createdAt.date() === dateNow.date() &&
          createdAt.month() === dateNow.month() &&
          createdAt.year() === dateNow.year()
        )
      })
      viewsData.push(viewsBinding.length)
      // * Add Shares Data
      const sharesBinding = resultsShares.filter(item => {
        const createdAt = dayjs(item.createdAt)
        return (
          createdAt.date() === dateNow.date() &&
          createdAt.month() === dateNow.month() &&
          createdAt.year() === dateNow.year()
        )
      })
      sharesData.push(sharesBinding.length)
      // * Add Likes Data
      const likesBinding = resultsLikes.filter(item => {
        const createdAt = dayjs(item.createdAt)
        return (
          createdAt.date() === dateNow.date() &&
          createdAt.month() === dateNow.month() &&
          createdAt.year() === dateNow.year()
        )
      })
      likesData.push(likesBinding.length)
      // * Add Contents Data
      const contentsBinding = contents.filter(item => {
        const createdAt = dayjs(item.publishedAt)
        return (
          createdAt.date() === dateNow.date() &&
          createdAt.month() === dateNow.month() &&
          createdAt.year() === dateNow.year()
        )
      })
      contentsData.push(contentsBinding.length > 0 ? -1 : 0)
    }

    return Response.json(
      {
        xAxis: { data: xAxis, label: xAxisLabel },
        series: [
          { data: viewsData, label: 'Uique Views', type: 'line' },
          { data: sharesData, label: 'Shares', type: 'line' },
          { data: likesData, label: 'Impressions', type: 'line' },
          { data: contentsData, label: 'Content Uploads', type: 'bar' }
        ]
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
