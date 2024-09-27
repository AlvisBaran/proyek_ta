import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import ContentRequestMember from '@/backend/models/contentrequestmember'

import '@/backend/models/association'

// ** User > Content Request > Member > Read All
export async function DELETE(request, response) {
  const { id } = response.params
  const { memberId } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // !! Cek" segala macem harusnya ditambahkan tapi karena untuk TA ya sudah langsung delete saja

  const currMember = await ContentRequestMember.findOne({
    where: {
      id: Number(memberId),
      contentRequestRef: Number(id)
    }
  })
  if (!currMember) {
    res = { message: 'Member tidak ditemukan!' }
    return Response.json(res, { status: 404 })
  }

  return await currMember
    .destroy()
    .then(() => {
      res = { message: responseString.GLOBAL.SUCCESS }
      return Response.json(res, { status: 200 })
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.DELETE_FAILED }, details: error }
      return Response.json(res, { status: 400 })
    })
}
