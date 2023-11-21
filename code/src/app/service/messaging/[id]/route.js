import Joi from "joi"

import { responseString } from "@/backend/helpers/serverResponseString"
import User from "@/backend/models/user";
import Message from "@/backend/models/message";
import Chat from "@/backend/models/chat";

// Message > Read One
export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const withChats = searchParams.get('withChats')
  let orderType = searchParams.get('orderType') ?? 'ASC';
  orderType = (orderType+"").toUpperCase();
  const { id } = params;
  let res = {};

  const joiValidate = Joi.object({
    id: Joi.number().required(),
    userId: Joi.number().required(),
    withChats: Joi.any().allow(null).optional(),
    orderType: Joi.valid("ASC", "DESC").optional(),
  }).validate({...params, userId, withChats, orderType}, {abortEarly: false});

  if (!joiValidate.error) {
    // Cek user ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek chat room ada
    let currMessageRoom = await Message.findByPk(id);
    if (!currMessageRoom) {
      res = { message: responseString.MESSAGING.ROOM_NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Load partner
    let partnerId = currMessageRoom.user2Ref;
    if (currUser.id === partnerId) partnerId = currMessageRoom.user1Ref;
    let partnerData = await User.findByPk(partnerId);

    // Load chats
    let chats = [];
    if (!!withChats) {
      let currChats = await Chat.findAll({
        where: { messagesRef: currMessageRoom.id },
        orderType: [['createdAt', orderType]],
      });
      
      for (let i = 0; i < currChats.length; i++) {
        const tempChat = currChats[i];
        chats.push({
          ...tempChat.dataValues,
          id: undefined,
          messagesRef: undefined,
        })
      }
    }

    currMessageRoom = {
      ...currMessageRoom.dataValues,
      partnerData: {
        id: partnerData.id,
        role: partnerData.role,
        displayName: partnerData.displayName,
        email: partnerData.email,
        profilePicture: partnerData.profilePicture,
        // themeColor: partnerData.themeColor,
      },
      chats: withChats?chats:undefined,
    }

    return Response.json(currMessageRoom, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Message > Add Chat
export async function PUT(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    id: Joi.number().required(),
    userId: Joi.number().required(),
    content: Joi.string().required(),
  }).validate({...params, ...req, userId}, {abortEarly: false});

  if (!joiValidate.error) {
    const { content } = req;

    // Cek user ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek chat room ada
    let currMessageRoom = await Message.findByPk(id);
    if (!currMessageRoom) {
      res = { message: responseString.MESSAGING.ROOM_NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek room memang milik user tersebut
    if (currUser.id !== currMessageRoom.user1Ref && currUser.id !== currMessageRoom.user2Ref) {
      res = { message: responseString.MESSAGING.CHAT_ADD_FAILED+" Room bukan milik user!" };
      return Response.json(res, { status: 403 });
    }

    let newChat = Chat.build({
      messagesRef: currMessageRoom.id,
      authorRef: userId,
      content,
    });

    // Masukkan chat ke database
    return await newChat.save()
      .then(async (resp) => {
        await newChat.reload();
        res = {
          message: responseString.GLOBAL.SUCCESS,
          newValues: {
            ...newChat.dataValues,
          },
        }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.MESSAGING.CHAT_ADD_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      })
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Message > Delete
export async function DELETE(request, { params }) {
  const searchParams = request.nextUrl.searchParams
  const userId = Number(searchParams.get('userId'))
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  // Cek user ada
  let currUser = await User.findByPk(userId);
  if (!currUser) {
    res = { message: responseString.USER.NOT_FOUND };
    return Response.json(res, { status: 404 });
  }

  // Cek chat room ada
  let currMessageRoom = await Message.findByPk(id);
  if (!currMessageRoom) {
    res = { message: responseString.MESSAGING.ROOM_NOT_FOUND };
    return Response.json(res, { status: 404 });
  }
  else {
    // Cek chat room memang milik user
    if (currMessageRoom.user1Ref === currUser.id || currMessageRoom.user2Ref === currUser.id) {
      return await currMessageRoom.destroy()
      .then((resp) => {
        res = { message: responseString.GLOBAL.SUCCESS, }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.MESSAGING.ROOM_DELETE_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      })
    }
    else {
      res = { error: { message: responseString.MESSAGING.ROOM_DELETE_FAILED+" Room bukan milik user!" }, };
      return Response.json(res, { status: 403 });
    }
  }
  // return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
}