import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import Comment from '@/backend/models/comment'
import Reply from '@/backend/models/reply'

import '@/backend/models/association'

// ** User > Content > Comment > Read All
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const withReplies = searchParams.get('noReplies') ? false : true
  const { contentId } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  let include = []
  let order = [[Comment, 'createdAt', 'DESC']]
  let commentInclude = [
    {
      model: User,
      attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
    }
  ]
  if (withReplies) {
    order.push([Comment, Reply, 'createdAt', 'ASC'])
    commentInclude.push({
      model: Reply,
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: {
        model: User,
        attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
      }
    })
  }
  include.push({
    model: Comment,
    attributes: ['id', 'content', 'createdAt', 'updatedAt'],
    include: commentInclude
  })

  let currContent = await Content.findOne({
    where: { id: contentId },
    attributes: ['id', 'createdAt', 'publishedAt'],
    include,
    order
  })
  if (!currContent) {
    res = { message: responseString.GLOBAL.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  const existingProfilePicture = []
  const comments = []
  for (let i = 0; i < currContent.Comments.length; i++) {
    const currComment = currContent.Comments[i]
    let profilePictureUrl = null

    if (!!currComment.User) {
      const existing = existingProfilePicture.find(item => item.id === currComment.User.id)
      if (!!existing) profilePictureUrl = existing.profilePictureUrl
      else {
        if (!!currComment.User.profilePicture)
          await minioClient
            .presignedGetObject(mainBucketName, currComment.User.profilePicture)
            .then(url => {
              profilePictureUrl = url
              existingProfilePicture.push({ id: currComment.User.id, profilePictureUrl: url })
            })
            .catch(error => {
              console.error('minio ERROR: presignedGetObject', error)
            })
      }
    }

    // * Untuk replies
    const replies = []
    if (withReplies)
      for (let j = 0; j < currComment.Replies.length; j++) {
        const currReply = currComment.Replies[j]
        let profilePictureUrlReply = null

        if (!!currReply.User) {
          const existingReply = existingProfilePicture.find(item => item.id === currReply.User.id)
          if (!!existingReply) profilePictureUrlReply = existingReply.profilePictureUrl
          else {
            if (!!currReply.User.profilePicture)
              await minioClient
                .presignedGetObject(mainBucketName, currReply.User.profilePicture)
                .then(url => {
                  profilePictureUrlReply = url
                  existingProfilePicture.push({ id: currReply.User.id, profilePictureUrl: url })
                })
                .catch(error => {
                  console.error('minio ERROR: presignedGetObject', error)
                })
          }
        }

        replies.push({
          ...currReply.dataValues,
          User: {
            ...currReply.User.dataValues,
            profilePictureUrl: profilePictureUrlReply
          }
        })
      }

    comments.push({
      ...currComment.dataValues,
      User: {
        ...currComment.User.dataValues,
        profilePictureUrl
      },
      Replies: replies
    })
  }

  return Response.json(comments, { status: 200 })
}

// ** User > Content > Comment > Create
export async function POST(request, response) {
  const { contentId } = response.params
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

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    content: Joi.string().min(1).trim().required()
  }).validate({ contentId, ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek content ada
    let currContent = await Content.findByPk(contentId)
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }
    // * Cek syarat, dll untuk comment (nanti aja)
    // * Add ke database
    let newComment = Comment.build({
      content: req.content,
      contentRef: currContent.id,
      authorRef: user.id
    })

    return await newComment
      .save()
      .then(async resp => {
        await newComment.reload({
          include: {
            model: User,
            attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
          },
          attributes: ['id', 'content', 'createdAt']
        })
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newComment.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
