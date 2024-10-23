import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'
import User from '@/backend/models/user'

export const dynamic = 'force-dynamic'

export async function GET(request, response) {
  const creatorId = Number(response.params.creatorId)
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  // * Cek user adalah admin
  if (user.role !== 'admin') {
    res = { message: responseString.USER.NOT_ADMIN }
    return Response.json(res, { status: 403 })
  }

  // * Get current creator
  const currCreator = await User.findOne({ where: { id: creatorId, role: 'creator' }, attributes: ['id', 'role'] })
  if (!currCreator) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // * Ambil Contents
  const contents = await Content.findAll({
    where: {
      creatorRef: currCreator.id,
      contentRequestRef: null
    },
    attributes: ['id', 'creatorRef', 'contentRequestRef', 'viewCounter', 'likeCounter', 'shareCounter']
  })
  const contentIds = contents.map(item => item.id)

  // * Ambil Jumlah Total Content Views
  const viewsCount = (await ContentUniqueViews.count({ where: { contentRef: contentIds } })) ?? 0

  // * Ambil Jumlah Total Content Shares
  const sharesCount = contents.reduce((total, item) => total + Number(item.shareCounter), 0) ?? 0

  // * Ambil Jumlah Total Content Likes
  const likesCount = contents.reduce((total, item) => total + Number(item.likeCounter), 0) ?? 0

  return Response.json({ viewsCount, sharesCount, likesCount }, { status: 200 })
}
