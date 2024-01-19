import Joi from "joi";
import Content from "@/backend/models/content";
import { responseString } from "@/backend/helpers/serverResponseString";
import User from "@/backend/models/user";
import Comment from "@/backend/models/comment";
import Reply from "@/backend/models/reply";
import '@/backend/models/association'

// User > Content > Get One Content
export async function GET(request, { params }) {
  // TODO: Get content (with gallery)
  // TODO: Ada opsi untuk load lengkap (comment, reply)
  const searchParams = request.nextUrl.searchParams
  const withComments = searchParams.get('noComments') ? false : true
  const withReplies = searchParams.get('noReplies') ? false : true
  let userId = searchParams.get('userId') ?? null
  const { contentId } = params;
  let res = {};

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    userId: Joi.number().allow(null),
  }).validate({...params, userId}, {abortEarly: false});

  if (!joiValidate.error) {
    // TODO: Cek user ada (klo ga ada gpp)
    let currUser = null;
    if (!!userId) {
      userId = Number(userId)
      currUser = await User.findByPk(userId);
    }
    // TODO: Fetch content sekalian cek ada
    let include = [
      {
        model: User,
        as: "Creator",
        attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"]
      }
    ]
    let order = []
    if (withComments) {
      order.push([Comment, 'createdAt', 'DESC'])
      let commentInclude = [
        {
          model: User,
          attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"]
        }
      ]
      if (withReplies) {
        order.push([Comment, Reply, 'createdAt', 'DESC'])
        commentInclude.push({
          model: Reply,
          attributes: ["id", "content", "createdAt", "updatedAt"],
          include: {
            model: User,
            attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"]
          }
        })
      }
      include.push({
        model: Comment,
        attributes: ["id", "content", "createdAt", "updatedAt"],
        include: commentInclude,
      })
    }
    let currContent = await Content.findOne({
      where: { id: contentId },
      include,
      order
    });
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }

    // TODO(DONE): Cek content public or private
    if (currContent.type === 'private') {
      // TODO(DONE): -> kalo private dan user login ga ada return
      if (!currUser) {
        res = { message: responseString.GLOBAL.FORBIDDEN, error: 'FORBIDDEN!' };
        return Response.json(res, { status: 403 });
      }
      else {
        // TODO: -> kalo private dan user login ada cek membershipnya
        // TODO: ---> kalo membership ga ada return
        // TODO(DONE): ---> kalo ada ya lanjut
      }
    }
    // TODO(DONE): -> kalo public ya udah next

    return Response.json({
      ...currContent.dataValues,
    }, { status: 200 });
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}
