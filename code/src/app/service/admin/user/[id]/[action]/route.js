import Joi from "joi";
import { FieldValue } from "firebase-admin/firestore";

import User from "@/backend/models/User";
import { configName, convertPath } from "@/backend/models/tableNames";
import { removeUndefined } from "@/backend/helpers/modelHelper";
import { responseString } from "@/backend/helpers/serverResponseString";
import { adminDB } from "@/configs/firebase-admin/adminApp";

// Admin > User > Action
export async function PUT(request, { params }) {
  const { id, action } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  if (action === 'ban_status') {
    return await handleBanStatus(id, req);
  }
  else if (action === 'change_role') {
    return await handleChangeRole(id, req);
  }
  else if (action === 'change_email') {
    return await handleChangeEmail(id, req);
  }
  else {
    res = { error: responseString.SERVER.SERVER_ERROR };
    return Response.json(res, { status: 400 });
  }
}

// Admin > User > Ban or Unban
async function handleBanStatus(id, req) {
  let res = { message: "handleBanStatus", id, req };

  let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
  if (!currUser.exists) {
    res = { message: responseString.USER.NOT_FOUND };
    return Response.json(res, { status: 404 });
  }
  let tempUser = new User({ ...currUser.data() });
  
  if (!!req.type) {
    if (req.type === 'ban') {
      if (tempUser.ban_status === 'clean' || tempUser.ban_status === 'unbanned') {
        tempUser.ban_status = 'banned';
        tempUser.last_banned = FieldValue.serverTimestamp();
      }
      else {
        res = { warning: "Tidak dapat ban user yang sudah di ban!" };
        return Response.json(res, { status: 200 });
      }
    }
    else if (req.type === 'unban') {
      if (tempUser.ban_status === 'banned') {
        tempUser.ban_status = 'unbanned';
      }
      else {
        res = { warning: "Tidak dapat unban user yang tidak di ban!" };
        return Response.json(res, { status: 200 });
      }
    }

    return await adminDB.collection(convertPath(configName.USER)).doc(id)
    .set(removeUndefined({
      ban_status: tempUser.ban_status,
      last_banned: tempUser.last_banned ?? null,
    }), { merge: true })
    .then(() => {
      res = {
        message: responseString.GLOBAL.SUCCESS,
        method: req.type,
      };

      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error };
      // throw new Error(res)
      return Response.json(res, { status: 400 });
    });
  }
  else {
    res = {
      error: { type: "Terdapat kesalahan pada field \"type\"!" },
    };
    return Response.json(res, { status: 400 });
  }
}

// Admin > User > Change Role
async function handleChangeRole(id, req) {
  let res = { message: "handleChangeRole", id, req };

  let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
  if (!currUser.exists) {
    res = { message: responseString.USER.NOT_FOUND };
    return Response.json(res, { status: 404 });
  }
  let tempUser = new User({ ...currUser.data() });
  
  if (!!req.to && (req.to === 'normal' || req.to === 'creator' || req.to === 'admin')) {
    if (req.to === tempUser.role) {
      res = { warning: "Role sudah dimiliki oleh user tersebut!"};
      return Response.json(res, { status: 400 });
    }

    return await adminDB.collection(convertPath(configName.USER)).doc(id)
    .set(removeUndefined({
      role: req.to,
    }), { merge: true })
    .then(() => {
      res = {
        message: responseString.GLOBAL.SUCCESS,
        from: tempUser.role,
        changed_to: req.to,
      };

      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error };
      // throw new Error(res)
      return Response.json(res, { status: 400 });
    });
  }
  else {
    res = {
      error: { to: "Terdapat kesalahan pada field \"to\"!" },
    };
    return Response.json(res, { status: 400 });
  }
}

// Admin > User > Change Email
async function handleChangeEmail(id, req) {
  let res = { message: "handleChangeEmail", id, req };

  const joiValidate = Joi.object({
    new_email: Joi.string().email().required(),
  }).validate(req, {abortEarly: false});

  if (!joiValidate.error) {
    // return Response.json({
    //   res: convertPath(configName.MEMBERSHIP, ["6brP1isg4xMsuw28nuqUeShTIgL2"]),
    // });
    // await adminDB.collection("users/6brP1isg4xMsuw28nuqUeShTIgL2/memberships").add({test: true});
    return Response.json({ error: responseString.GLOBAL.UNFINISHED_SERVICE }, { status: 403 });
    // let currUser = await adminDB.collection(convertPath(configName.USER)).doc(id).get();
    // if (!currUser.exists) {
    //   res = { message: responseString.USER.NOT_FOUND };
    //   return Response.json(res, { status: 404 });
    // }
    // let tempUser = new User({ ...currUser.data() });

    // return await adminDB.collection(convertPath(configName.USER)).doc(id)
    // .set(removeUndefined({
    //   role: req.to,
    // }), { merge: true })
    // .then(() => {
    //   res = {
    //     message: responseString.GLOBAL.SUCCESS,
    //     from: tempUser.role,
    //     changed_to: req.to,
    //   };

    //   return Response.json(res, { status: 200 });
    // })
    // .catch(error => {
    //   res = { error: { message: responseString.USER.UPDATE_FAILED }, details: error };
    //   // throw new Error(res)
    //   return Response.json(res, { status: 400 });
    // });
  }
  else {
    res = {
      error: { new_email: "Terdapat kesalahan pada field \"new_email\"!" },
    };
    return Response.json(res, { status: 400 });
  }
}