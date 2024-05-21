import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Message from '@/backend/models/message'
import sqlz from '@/backend/configs/db'
import Chat from '@/backend/models/chat'

// ** User > Message > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  let res = {}

  // Cek user ada
  let currUser = await User.findByPk(userId)
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND }
    return Response.json(res, { status: 404 })
  }

  let messages = []

  return await sqlz
    .query(`select * from ${Message.tableName} where user1Ref=${userId} or user2Ref=${userId} order by createdAt desc;`)
    .then(async ([resp] = []) => {
      for (let i = 0; i < resp.length; i++) {
        const datum = resp[i]
        let lastChat = await Chat.findOne({
          where: { messagesRef: datum.id },
          order: [['createdAt', 'DESC']]
        })
        let partnerId = datum.user2Ref
        if (userId === partnerId) partnerId = datum.user1Ref
        let partnerData = await User.findByPk(partnerId)
        messages.push({
          ...datum,
          partnerData: {
            id: partnerData.id,
            role: partnerData.role,
            displayName: partnerData.displayName,
            email: partnerData.email,
            profilePicture: partnerData.profilePicture
            // themeColor: partnerData.themeColor,
          },
          lastChat: !!lastChat
            ? {
                ...lastChat.dataValues,
                id: undefined,
                messagesRef: undefined
              }
            : undefined
        })
      }
      return Response.json(messages, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR, err }, { status: 500 })
    })
}

// ** User > Message > Create
export async function POST(request) {
  let req = {}
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    userId: Joi.number().required(),
    user2Id: Joi.number().required()
  }).validate({ ...req, userId }, { abortEarly: false })

  if (!joiValidate.error) {
    const { user2Id } = req
    // Cek user 1 ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek user 2 ada
    let currUser2 = await User.findByPk(user2Id)
    if (!currUser2) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // Cek ke 2 user tersebut sudah pernah chat atau belum
    let roomExist = false
    let currMessageRoom = await Message.findOne({
      where: {
        user1Ref: userId,
        user2Ref: user2Id
      }
    })
    if (!!currMessageRoom) {
      roomExist = true
    } else {
      currMessageRoom = await Message.findOne({
        where: {
          user1Ref: user2Id,
          user2Ref: userId
        }
      })
      if (!!currMessageRoom) {
        roomExist = true
      }
    }

    if (roomExist) {
      res = {
        message: responseString.MESSAGING.ROOM_ALREADY_EXISTS,
        roomData: { ...currMessageRoom.dataValues }
      }
      return Response.json(res, { status: 404 })
    } else {
      let newMessageRoom = Message.build({
        user1Ref: currUser.id,
        user2Ref: currUser2.id
      })

      // Daftarkan message room ke database
      return await newMessageRoom
        .save()
        .then(async resp => {
          await newMessageRoom.reload()
          res = {
            message: responseString.GLOBAL.SUCCESS,
            newValues: {
              ...newMessageRoom.dataValues
            }
          }
          return Response.json(res, { status: 200 })
        })
        .catch(error => {
          res = { error: { message: responseString.MESSAGING.ROOM_ADD_FAILED }, details: error }
          // throw new Error(res)
          return Response.json(res, { status: 400 })
        })
    }
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
