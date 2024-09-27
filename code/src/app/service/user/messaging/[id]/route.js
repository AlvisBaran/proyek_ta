import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { mainBucketName, minioClient } from '@/minio/config'

import sqlz from '@/backend/configs/db'
import User from '@/backend/models/user'
import Message from '@/backend/models/message'
import Chat from '@/backend/models/chat'

import '@/backend/models/association'
import { literal, where } from 'sequelize'

// ** User > Message > Read One
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const withChats = searchParams.get('withChats')
  let orderType = searchParams.get('orderType') ?? 'ASC'
  orderType = (orderType + '').toUpperCase()
  const { id } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    withChats: Joi.any().allow(null).optional(),
    orderType: Joi.valid('ASC', 'DESC').optional()
  }).validate({ withChats, orderType }, { abortEarly: false })

  if (!joiValidate.error) {
    const include = [
      { model: User, as: 'User1', attributes: ['id', 'cUsername', 'email', 'profilePicture', 'role', 'displayName'] },
      { model: User, as: 'User2', attributes: ['id', 'cUsername', 'email', 'profilePicture', 'role', 'displayName'] }
    ]

    if (withChats) include.push({ model: Chat, order: [['createdAt', 'ASC']] })

    // * Cek chat room ada
    let currMessageRoom = await Message.findOne({
      where: { id },
      include
    })
    if (!currMessageRoom) {
      res = { message: responseString.MESSAGING.ROOM_NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek room adalah milik user
    if (currMessageRoom.user1Ref !== user.id && currMessageRoom.user2Ref !== user.id) {
      res = { message: responseString.MESSAGING.ROOM_NOT_OWNED_BY_USER }
      return Response.json(res, { status: 403 })
    }

    // * Set Up Main User & Partner
    const MainUser = user.id === currMessageRoom.user1Ref ? currMessageRoom.User1 : currMessageRoom.User2
    let mainUserProfilePictureUrl = null
    if (!!MainUser && !!MainUser.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, MainUser.profilePicture)
        .then(url => {
          mainUserProfilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    const Partner = user.id === currMessageRoom.user1Ref ? currMessageRoom.User2 : currMessageRoom.User1
    let partnerProfilePictureUrl = null
    if (!!Partner && !!Partner.profilePicture) {
      await minioClient
        .presignedGetObject(mainBucketName, Partner.profilePicture)
        .then(url => {
          partnerProfilePictureUrl = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    const chats = []

    if (withChats) {
      for (let i = 0; i < currMessageRoom.Chats?.length; i++) {
        const tempChat = currMessageRoom.Chats[i]
        chats.push({
          ...tempChat.dataValues,
          Author:
            tempChat.authorRef === Partner.id
              ? { ...Partner.dataValues, profilePictureUrl: partnerProfilePictureUrl }
              : {
                  ...MainUser.dataValues,
                  profilePictureUrl: mainUserProfilePictureUrl
                }
        })
      }
    }

    currMessageRoom = {
      ...currMessageRoom.dataValues,
      Partner: { ...Partner.dataValues, profilePictureUrl: partnerProfilePictureUrl },
      User1: undefined,
      User2: undefined,
      Chats: withChats ? chats : undefined
    }

    return Response.json(currMessageRoom, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** User > Message > Add Chat
export async function PUT(request, response) {
  const { id } = response.params
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
    id: Joi.number().required(),
    content: Joi.string().required()
  }).validate({ ...req, id }, { abortEarly: false })

  if (!joiValidate.error) {
    const { content } = req
    // * Cek chat room ada
    let currMessageRoom = await Message.findByPk(id)
    if (!currMessageRoom) {
      res = { message: responseString.MESSAGING.ROOM_NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek room memang milik user tersebut
    if (user.id !== currMessageRoom.user1Ref && user.id !== currMessageRoom.user2Ref) {
      res = {
        message: `${responseString.MESSAGING.CHAT_ADD_FAILED}. ${responseString.MESSAGING.ROOM_NOT_OWNED_BY_USER}`
      }
      return Response.json(res, { status: 403 })
    }

    let newChat = Chat.build({
      messageRef: currMessageRoom.id,
      authorRef: user.id,
      content
    })

    // * Masukkan chat ke database
    const t = await sqlz.transaction()

    try {
      // ? Ini untuk supaya updated at nya message jalan
      await Message.update(
        { user1Ref: currMessageRoom.user1Ref },
        { where: { id: currMessageRoom.id }, transaction: t }
      )
      await newChat.save({ transaction: t })

      await t.commit()
      await newChat.reload()

      res = {
        message: responseString.GLOBAL.SUCCESS,
        newValues: {
          ...newChat.dataValues
        }
      }
      return Response.json(res, { status: 200 })
    } catch (err) {
      await t.rollback()
      res = { error: { message: responseString.MESSAGING.CHAT_ADD_FAILED }, details: error }
      return Response.json(res, { status: 400 })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}

// ** User > Message > Delete
export async function DELETE(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const { id } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // Cek user ada
  let currUser = await User.findByPk(userId)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  // Cek chat room ada
  let currMessageRoom = await Message.findByPk(id)
  if (!currMessageRoom) {
    res = { message: responseString.MESSAGING.ROOM_NOT_FOUND }
    return Response.json(res, { status: 404 })
  } else {
    // Cek chat room memang milik user
    if (currMessageRoom.user1Ref === currUser.id || currMessageRoom.user2Ref === currUser.id) {
      return await currMessageRoom
        .destroy()
        .then(resp => {
          res = { message: responseString.GLOBAL.SUCCESS }
          return Response.json(res, { status: 200 })
        })
        .catch(error => {
          res = { error: { message: responseString.MESSAGING.ROOM_DELETE_FAILED }, details: error }
          return Response.json(res, { status: 400 })
        })
    } else {
      res = { error: { message: responseString.MESSAGING.ROOM_DELETE_FAILED + ' Room bukan milik user!' } }
      return Response.json(res, { status: 403 })
    }
  }
  // return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
}
