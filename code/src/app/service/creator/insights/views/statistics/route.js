import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'

export const dynamic = 'force-dynamic'

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

  // * Ambil Contents
  const contents = await Content.findAll({
    where: {
      creatorRef: user.id,
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
