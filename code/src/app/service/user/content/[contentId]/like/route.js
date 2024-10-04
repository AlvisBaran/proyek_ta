import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import sqlz from '@/backend/configs/db'
import Content from '@/backend/models/content'
import ContentLikes from '@/backend/models/contentlikes'

import '@/backend/models/association'

// ** User > Content > Like / Unlike
export async function PUT(request, response) {
  const contentId = response.params.contentId
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    contentId: Joi.number().required()
  }).validate({ contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Content Ada
    let currContent = await Content.findByPk(contentId, {
      attributes: ['id', 'type', 'status', 'likeCounter']
    })
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // TODO: Cek segala macem syarat untuk like (jika perlu)

    // * Cek User Sudah Pernah Like
    let existItem = await ContentLikes.findOne({
      where: { performerRef: user.id, contentRef: contentId },
      paranoid: false
    })

    const t = await sqlz.transaction()

    try {
      if (!!existItem) {
        // ** Logic untuk toggle like status
        if (existItem.deletedAt === null || existItem.deletedAt === undefined) {
          await currContent.decrement('likeCounter', { by: 1, transaction: t })
          await existItem.destroy({ transaction: t })
          await t.commit()

          await currContent.reload({ attributes: ['id', 'likeCounter'] })
          res = { message: responseString.GLOBAL.SUCCESS, method: 'DESTROY', newCount: currContent.likeCounter }
          return Response.json(res, { status: 200 })
        } else {
          await currContent.increment('likeCounter', { by: 1, transaction: t })
          await existItem.restore({ transaction: t })
          await t.commit()

          await currContent.reload({ attributes: ['id', 'likeCounter'] })
          res = { message: responseString.GLOBAL.SUCCESS, method: 'RESTORE', newCount: currContent.likeCounter }
          return Response.json(res, { status: 200 })
        }
      } else {
        // ** Logic untuk create new
        // * Insert Data
        let newItem = ContentLikes.build({
          performerRef: user.id,
          contentRef: contentId
        })

        await currContent.increment('likeCounter', { by: 1, transaction: t })
        await newItem.save({ transaction: t })
        await t.commit()

        await currContent.reload({ attributes: ['id', 'likeCounter'] })
        await newItem.reload()
        res = {
          message: responseString.GLOBAL.SUCCESS,
          method: 'CREATE_NEW',
          newCount: currContent.likeCounter
        }
        return Response.json(res, { status: 200 })
      }
    } catch (err) {
      await t.rollback()
      res = { message: responseString.GLOBAL.TRANSACTION_ERROR, error: err }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
