import { literal } from 'sequelize'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import Content from '@/backend/models/content'

// ** Creator > Content > Action
export async function PUT(request, response) {
  const { id, action } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
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

  if (action === 'publish_status') {
    return await handlePublishStatus(id, user, req)
  } else {
    res = { error: responseString.SERVER.SERVER_ERROR }
    return Response.json(res, { status: 400 })
  }
}

// ** Creator > Content > Publish or Unpublish
async function handlePublishStatus(id, user, req) {
  let res = { message: 'handlePublishStatus', id, user, req }
  const { type } = req

  // * Cek content ada dan milik user yang sedang merequest
  let currContent = await Content.findOne({
    where: {
      id,
      creatorRef: user.id
    }
  })
  if (!currContent) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  let changingAttributes = []

  if (!!type) {
    if (type === 'publish') {
      if (currContent.status === 'draft') {
        currContent.status = 'published'
        currContent.publishedAt = literal('CURRENT_TIMESTAMP')
        changingAttributes = ['status', 'publishedAt']
      } else {
        res = { warning: 'Tidak dapat publish content yang sudah di publish!' }
        return Response.json(res, { status: 200 })
      }
    } else if (type === 'unpublish') {
      if (currContent.status === 'published') {
        currContent.status = 'draft'
        changingAttributes = ['status']
      } else {
        res = { warning: 'Tidak dapat unpublish content yang belum di publish!' }
        return Response.json(res, { status: 200 })
      }
    }

    return await currContent
      .save({ fields: [...changingAttributes] })
      .then(async resp => {
        await currContent.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          method: type,
          newValues: {
            ...currContent.dataValues
          }
        }

        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = {
      error: { type: 'Terdapat kesalahan pada field "type"!' }
    }
    return Response.json(res, { status: 400 })
  }
}
