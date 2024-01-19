import '@/backend/models/association'
import Joi from "joi";
import { responseString } from "@/backend/helpers/serverResponseString";
import User from '@/backend/models/user';

// User > Relationship > Follow / Unfollow Creator
export async function PUT(request) {
  // TODO: Update user profile data
  const searchParams = request.nextUrl.searchParams
  let userId = searchParams.get('userId') ?? null
  let req = {};
  try {
    const formData = await request.formData();
    req.displayName = formData.get('displayName');
    req.profilePicture = formData.get('profilePicture');
    req.bio = formData.get('bio');
    req.about = formData.get('about');
    req.banner = formData.get('banner');
    req.themeColor = formData.get('themeColor');
  } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    userId: Joi.number().allow(null),
    displayName: Joi.string().allow(null),
    profilePicture: Joi.object().allow(null),
    bio: Joi.string().allow(null),
    about: Joi.string().allow(null),
    banner: Joi.object().allow(null),
    themeColor: Joi.string().allow(null)
  }).validate({...req, userId}, {abortEarly: false});

  if (!joiValidate.error) {
    // TODO: Cek user ada
    const fetchAttributes = [
      "id",
      "cUsername",
      "role",
      "banStatus",
      "displayName",
      "email",
      "profilePicture",
      "banner",
      "bio",
      "about",
      "themeColor"
    ]
    let currUser = await User.findByPk(userId, {
      attributes: fetchAttributes,
    });
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // TODO: Masukkan data yang mau diupdate
    let changingAttributes = []
    let oldValues = {}
    let newDisplayName = String(req.displayName).trim()
    if (!!req.displayName && newDisplayName.length > 0) {
      oldValues.displayName = currUser.displayName
      currUser.displayName = newDisplayName
      changingAttributes.push('displayName')
    }
    if (!!req.bio) {
      oldValues.bio = currUser.bio
      currUser.bio = req.bio
      changingAttributes.push('bio')
    }
    if (!!req.about) {
      oldValues.about = currUser.about
      currUser.about = req.about
      changingAttributes.push('about')
    }
    if (!!req.themeColor) {
      oldValues.themeColor = currUser.themeColor
      currUser.themeColor = req.themeColor
      changingAttributes.push('themeColor')
    }
    // TODO: Handle untuk profilePicture dan banner

    // TODO: Update ke db
    return await currUser.save({ fields: [...changingAttributes] })
    .then(async (resp) => {
      await currUser.reload({
        attributes: fetchAttributes
      });
      res = {
        message: responseString.USER.UPDATE_SUCCESS,
        oldValues,
        newValues: {
          ...currUser.dataValues,
        },
      };

      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error };
      return Response.json(res, { status: 400 });
    });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
} 