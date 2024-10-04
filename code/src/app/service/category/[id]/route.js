import { responseString } from '@/backend/helpers/serverResponseString'

import Category from '@/backend/models/category'

// ** Category > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  return await Category.findByPk(id)
    .then(resp => {
      return Response.json(resp.dataValues, { status: 200 })
    })
    .catch(error => {
      res = { message: responseString.GLOBAL.NOT_FOUND, error }
      return Response.json(res, { status: 404 })
    })
}
