import { responseString } from '@/backend/helpers/serverResponseString'

import Category from '@/backend/models/category'
import CategoriesXContents from '@/backend/models/categoriesxcontents'
import Content from '@/backend/models/content'

import '@/backend/models/association'

// ** Category > Popular > Read All
export async function GET() {
  let res = {}

  let categories = []
  return await Category.findAll({
    include: {
      model: CategoriesXContents,
      attributes: ['id'],
      include: { model: Content, attributes: ['id', 'status'], where: { status: 'published' } }
    },
    order: [
      ['createdAt', 'DESC'],
      ['label', 'ASC']
    ]
  })
    .then((resp = []) => {
      resp?.map(datum => categories.push({ ...datum?.dataValues }))

      categories = categories
        .filter(item => item.CategoriesXContents.length > 0)
        .sort((a, b) => b.CategoriesXContents.length - a.CategoriesXContents.length)
        .slice(0, 20)

      return Response.json(categories, { status: 200 })
    })
    .catch(err => {
      res = { message: responseString.SERVER.SERVER_ERROR, error: err }
      return Response.json(res, { status: 500 })
    })
}
