import { responseString } from '@/backend/helpers/serverResponseString'

import Bank from '@/backend/models/bank'

// ** Bank > Read One
export async function GET(request, response) {
  const { id } = response.params
  let res = {}

  return await Bank.findByPk(id)
    .then(resp => {
      return Response.json(resp.dataValues, { status: 200 })
    })
    .catch(error => {
      res = { message: responseString.GLOBAL.NOT_FOUND, error }
      return Response.json(res, { status: 404 })
    })
}
