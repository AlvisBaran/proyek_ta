import Joi from "joi";
import Content from "@/backend/models/content";
import { responseString } from "@/backend/helpers/serverResponseString";

// User > Content > Get One Content
export async function GET(request, { params }) {
  // TODO: Get content (with gallery)
  // TODO: Ada opsi untuk load lengkap (comment, reply)
  // const searchParams = request.nextUrl.searchParams
  // const creatorId = searchParams.get('creatorId')
  const { contentId } = params;
  let res = {};

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
  }).validate({...params}, {abortEarly: false});

  if (!joiValidate.error) {
    // TODO: Cek user ada (klo ga ada gpp)
    // TODO: Cek content ada
    // TODO: Cek content public or private
    // TODO: -> kalo private dan user login ga ada return
    // TODO: -> kalo private dan user login ada cek membershipnya
    // TODO: -> kalo public ya udah next


    // Cek content ada dan milik user yang sedang merequest
    let currContent = await Content.findOne({
      where: {
        id: contentId,
      },
    });
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
  
    return Response.json({
      ...currContent.dataValues,
    }, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}
