import Joi from "joi";

import sqlz from "@/backend/configs/db";
import { responseString } from "@/backend/helpers/serverResponseString";
import AccountUpgradeRequests from "@/backend/models/accountupgraderequests";
import User from "@/backend/models/user";

// Admin > Account Upgrade > Read One
export async function GET(request, { params }) {
  const { id } = params;
  let res = {};

  const joiValidate = Joi.object({
    id: Joi.number().required(),
  }).validate(params, {abortEarly: false});

  if (!joiValidate.error) {
    let currItem = await AccountUpgradeRequests.findByPk(id);
    if (!currItem) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let applicant = await User.findByPk(currItem.applicantRef);
    if (!applicant) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let admin = undefined;
    if (!!currItem.adminRef) {
      admin = await User.findByPk(currItem.applicantRef);
      if (!admin) {
        res = { message: responseString.USER.NOT_FOUND };
        return Response.json(res, { status: 404 });
      }
      admin = {
        ...admin.dataValues,
        saldo: undefined,
        socials: undefined,
        bio: undefined,
        about: undefined,
        banner: undefined,
        password: undefined,
      }
    }
  
    return Response.json({
      ...currItem.dataValues,
      applicant: {
        ...applicant.dataValues,
        saldo: undefined,
        socials: undefined,
        bio: undefined,
        about: undefined,
        banner: undefined,
        password: undefined,
      },
      admin,
    }, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}

// Admin > Account Upgrade > Send Response
export async function PUT(request, { params }) {
  const { id } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    idRequest: Joi.number().required(),
    adminId: Joi.number().required(),
    action: Joi.valid("approve", "decline").required(),
    adminNote: Joi.string().allow("").allow(null).required(),
    specifiedUsername: Joi.string().allow(null).optional(),
  }).validate({...req, idRequest: id}, {abortEarly: false});

  if (!joiValidate.error) {
    const { adminId, action, adminNote, specifiedUsername } = req;
    const idRequest = Number(id);

    let currRequest = await AccountUpgradeRequests.findByPk(idRequest);
    if (!currRequest) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    if (currRequest.status !== "requested") {
      res = { error: { message: "Status request sudah diupdate!" } }
      return Response.json(res, { status: 400 }); 
    }

    let currApplicant = await User.findByPk(currRequest.applicantRef);
    if (!currApplicant) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    let newUsername = currRequest.newUsername;
    if (!!specifiedUsername) newUsername = specifiedUsername;
    currRequest.newUsername = newUsername;
    currRequest.adminRef = adminId;
    if (!!adminNote) currRequest.adminNote = adminNote;

    // console.info(currRequest.dataValues)

    if (action === "approve") {
      try {
        await sqlz.transaction(async (t) => {
          // Update User/Applicant
          currApplicant.role = "creator";
          currApplicant.cUsername = newUsername;
          await currApplicant.save({ fields: ['role', 'cUsername'] })
          .catch((error) => { 
            throw new Error({ message: responseString.GLOBAL.UPDATE_FAILED, details: error })
          });
          // Update Account Upgrade Request
          currRequest.status = "approved";
          // Perlu dipisah dengan yang bawah karena yang ini ada dalam transaction
          await currRequest.save({ fields: ['status', 'newUsername', 'adminNote', 'adminRef'] })
          .catch((error) => { 
            throw new Error({ message: responseString.GLOBAL.UPDATE_FAILED, details: error })
          });
        })
      }
      catch (error) {
        res = { error: { message: responseString.GLOBAL.UPDATE_FAILED }, details: error };
        return Response.json(res, { status: 400 });
      }
    }
    else if (action === "decline") {
      // Update Account Upgrade Request
      currRequest.status = "declined";
      await currRequest.save({ fields: ['status', 'adminNote', 'adminRef'] })
      .catch((error) => { 
        res = { message: responseString.GLOBAL.UPDATE_FAILED, details: error };
        return Response.json(res, { status: 400 });
      });
    }

    await currRequest.reload();
    await currApplicant.reload();
    res = {
      message: responseString.GLOBAL.SUCCESS,
      upgradeRequest: {...currRequest.dataValues},
      applicant: {
        ...currApplicant.dataValues,
        saldo: undefined,
        socials: undefined,
        bio: undefined,
        about: undefined,
        banner: undefined,
        password: undefined,
      }
    }
    return Response.json(res, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}