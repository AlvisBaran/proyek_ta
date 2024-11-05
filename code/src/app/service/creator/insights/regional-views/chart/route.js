import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'
import User from '@/backend/models/user'
import Country from '@/backend/models/country'

import '@/backend/models/association'

export async function GET(request, response) {
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

  // * Getting Creator's Contents Id
  const contents = await Content.findAll({
    where: { creatorRef: user.id, contentRequestRef: null },
    attributes: ['id', 'publishedAt']
  })
  const contentIds = contents.map(item => item.id)

  // * Getting Views Data
  const resultsViews = await ContentUniqueViews.findAll({
    where: {
      contentRef: contentIds
    },
    include: {
      model: User,
      attributes: ['id', 'countryRef'],
      include: {
        model: Country
      }
    },
    order: [['createdAt', 'DESC']]
  })

  let xAxis = [] // ! ini isi nya countries dlu
  let xAxisLabel = undefined
  const viewsData = []

  resultsViews.map(item => {
    if (!!item.User && !!item.User.Country) {
      const exitingCountry = xAxis.find(country => country.id === item.User.Country.id)
      if (!exitingCountry) xAxis.push(item.User.Country)
    }
  })

  xAxis.map(country => {
    // * Add Views Data
    const viewsBinding = resultsViews.filter(item => item.User.Country.id === country.id)
    viewsData.push(viewsBinding.length)
  })

  xAxis = xAxis.map(item => item.name)

  return Response.json(
    {
      xAxis: { data: xAxis, label: xAxisLabel },
      series: [{ data: viewsData, label: 'Regional Views', type: 'bar' }]
    },
    { status: 200 }
  )
}
