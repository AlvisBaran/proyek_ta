import Joi from 'joi'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import { responseString } from '@/backend/helpers/serverResponseString'
import ContentLikes from '@/backend/models/contentlikes'

// User > Content > Like / Unlike
export async function PUT(request, { params }) {
  const contentId = params.contentId
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let res = {}

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    userId: Joi.number().required()
  }).validate({ userId, contentId }, { abortEarly: false })

  if (!joiValidate.error) {
    // Cek User Ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek Content Ada
    let currContent = await Content.findByPk(contentId)
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // TODO: Cek segala macem syarat untuk like (jika perlu)

    // Cek User Sudah Pernah Like
    let existItem = await ContentLikes.findOne({
      where: { performerRef: userId, contentRef: contentId },
      paranoid: false
    })
    if (!!existItem) {
      // ** Logic untuk toggle like status

      if (existItem.deletedAt === null || existItem.deletedAt === undefined) {
        return await existItem
          .destroy()
          .then(resp => {
            res = { message: responseString.GLOBAL.SUCCESS, method: 'DESTROY' }
            return Response.json(res, { status: 200 })
          })
          .catch(error => {
            res = { error: { message: responseString.GLOBAL.FAILED }, details: error }
            return Response.json(res, { status: 400 })
          })
      } else {
        return await existItem
          .restore()
          .then(resp => {
            res = { message: responseString.GLOBAL.SUCCESS, method: 'RESTORE' }
            return Response.json(res, { status: 200 })
          })
          .catch(error => {
            res = { error: { message: responseString.GLOBAL.FAILED }, details: error }
            return Response.json(res, { status: 400 })
          })
      }
    } else {
      // ** Logic untuk create new

      // Insert Data
      let newItem = ContentLikes.build({
        performerRef: userId,
        contentRef: contentId
      })

      return await newItem
        .save()
        .then(async resp => {
          await newItem.reload()
          res = {
            message: responseString.GLOBAL.SUCCESS,
            method: 'CREATE_NEW'
          }
          return Response.json(res, { status: 200 })
        })
        .catch(error => {
          res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
          return Response.json(res, { status: 400 })
        })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
