import '@/backend/models/association'
import Joi from "joi";
import { responseString } from "@/backend/helpers/serverResponseString";
import Comment from "@/backend/models/comment";
import Content from "@/backend/models/content";
import Reply from "@/backend/models/reply";
import User from "@/backend/models/user";

// User > Content > Comment > Reply > Get All
export async function GET() {
  // TODO: Fetch smua reply dari comment dari content
  
  // ** Tidak perlu kata verrel

  return Response.json({ message: "User > Content > Comment > Reply > Get All" })
}

// User > Content > Comment > Reply > Create
export async function POST(request, { params }) {
  // TODO: Insert reply ke db
  const searchParams = request.nextUrl.searchParams
  let userId = searchParams.get('userId') ?? null
  const { contentId, commentId } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    commentId: Joi.number().required(),
    userId: Joi.number().allow(null),
    content: Joi.string().min(1).trim().required()
  }).validate({...params, userId, ...req}, {abortEarly: false});

  if (!joiValidate.error) {
    // TODO: Cek user ada
    let currUser = await User.findByPk(userId);
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
    // TODO: Cek content ada
    let currContent = await Content.findByPk(contentId);
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
    // TODO: Cek comment ada
    let currComment = await Comment.findByPk(commentId);
    if (!currComment) {
      res = { message: responseString.GLOBAL.NOT_FOUND };
      return Response.json(res, { status: 404 });
    }
    // TODO: Cek comment milik content
    if (currComment.contentRef !== currContent.id) {
      res = { message: "Comment ini bukan milik content yang berkaitan!" };
      return Response.json(res, { status: 404 });
    }
    // TODO: Cek syarat, dll untuk reply (nanti aja)
    // TODO: Add ke database
    let newReply = Reply.build({
      content: req.content,
      commentRef: currComment.id,
      authorRef: currUser.id
    });

    return await newReply.save()
    .then(async (resp) => {
      await newReply.reload({
        include: {
          model: User,
          attributes: ["id", "cUsername", "role", "banStatus", "displayName", "email", "profilePicture"],
        },
        attributes: ["id", 'content', 'createdAt']
      });
      res = {
        message: responseString.GLOBAL.SUCCESS,
        created: {
          ...newReply.dataValues,
        },
      }
      return Response.json(res, { status: 200 });
    })
    .catch(error => {
      res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error };
      return Response.json(res, { status: 400 });
    })
  }
  else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
    return Response.json(res, { status: 400 });
  }
}