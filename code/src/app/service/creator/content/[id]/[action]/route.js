import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import { literal } from 'sequelize'

// Creator > Content > Action
export async function PUT(request, { params }) {
  const { id, action } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  if (action === 'publish_status') {
    return await handlePublishStatus(id, req)
  } else {
    res = { error: responseString.SERVER.SERVER_ERROR }
    return Response.json(res, { status: 400 })
  }
}

// Creator > Content > Publish or Unpublish
async function handlePublishStatus(id, req) {
  let res = { message: 'handlePublishStatus', id, req }
  const { creatorId, type } = req

  // Cek user ada
  let currCreator = await User.findByPk(creatorId)
  if (!currCreator) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek user adalah creator
  if (currCreator.role !== 'creator') {
    res = { message: 'Anda bukan seorang creator!' }
    return Response.json(res, { status: 403 })
  }

  // Cek content ada dan milik user yang sedang merequest
  let currContent = await Content.findOne({
    where: {
      id,
      creatorRef: currCreator.id
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
