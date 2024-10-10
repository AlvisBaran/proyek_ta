import { Op } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'

import Category from '@/backend/models/category'

// ** Category > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const keyword = searchParams.get('keyword') ?? null
  let res = {}

  let where = {}
  if (!!keyword) {
    where = { ...where, label: { [Op.iLike]: `%${keyword}%` } }
  }

  let categories = []
  return await Category.findAll({ where, order: [['createdAt', 'DESC']], paranoid: true })
    .then((resp = []) => {
      resp?.map(datum => categories.push({ ...datum?.dataValues }))

      return Response.json(categories, { status: 200 })
    })
    .catch(err => {
      res = { message: responseString.SERVER.SERVER_ERROR, error: err }
      return Response.json(res, { status: 500 })
    })
}
