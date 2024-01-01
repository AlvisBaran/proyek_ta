import Joi from "joi";

import { responseString } from "@/backend/helpers/serverResponseString";
import User from "@/backend/models/user";
import UsersFollows from "@/backend/models/usersfollows";

// User > Relationship > Follow / Unfollow Creator
export async function PUT(request, { params }) {
  const creatorId = params.id;
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let res = {};

  const joiValidate = Joi.object({
    creatorId: Joi.number().required(),
    userId: Joi.number().required(),
  }).validate({userId, creatorId}, {abortEarly: false});

  if (!joiValidate.error) {
    // Cek User Ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek Creator Ada
    let currCreator = await User.findByPk(creatorId);
    if (!currCreator) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // Cek Jika Target Creator bukan creator
    if (currCreator.role !== 'creator') {
      res = { message: "Target user bukan seorang creator!" };
      return Response.json(res, { status: 400 });
    }

    // Cek User Sudah Pernah Follow
    let existItem = await UsersFollows.findOne({
      where: { followerRef: userId, followedRef: creatorId },
      paranoid: false,
    });
    if (!!existItem) {
      // ** Logic untuk toggle follow status

      if (existItem.deletedAt === null || existItem.deletedAt === undefined) {
        return await existItem.destroy()
        .then((resp) => {
          res = { message: responseString.GLOBAL.SUCCESS, method: 'DESTROY' }
          return Response.json(res, { status: 200 });
        })
        .catch(error => {
          res = { error: { message: responseString.GLOBAL.FAILED }, details: error };
          return Response.json(res, { status: 400 });
        })
      }
      else {
        return await existItem.restore()
        .then((resp) => {
          res = { message: responseString.GLOBAL.SUCCESS, method: 'RESTORE' }
          return Response.json(res, { status: 200 });
        })
        .catch(error => {
          res = { error: { message: responseString.GLOBAL.FAILED }, details: error };
          return Response.json(res, { status: 400 });
        })
      }
    }
    else {
      // ** Logic untuk create new

      // Insert Data
      let newItem = UsersFollows.build({
        followerRef: userId,
        followedRef: creatorId,
      });
      
      return await newItem.save()
      .then(async (resp) => {
        await newItem.reload();
        res = {
          message: responseString.GLOBAL.SUCCESS,
          method: 'CREATE_NEW'
        }
        return Response.json(res, { status: 200 });
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      });
    }
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}