import '@/backend/models/association'
import Joi from 'joi'
import { responseString } from '@/backend/helpers/serverResponseString'
import Comment from '@/backend/models/comment'
import Content from '@/backend/models/content'
import User from '@/backend/models/user'

// User > Content > Comment > Read All
export async function GET() {
  // TODO: Fetch smua comment yang ada dari sebuah content
  // TODO: Ada opsi untuk load lengkap (reply)

  // ** Tidak perlu kata verrel

  return Response.json({ message: 'User > Content > Comment > Read All' })
}

// User > Content > Comment > Create
export async function POST(request, { params }) {
  // TODO: Inser comment baru ke db
  const searchParams = request.nextUrl.searchParams
  let userId = searchParams.get('userId') ?? null
  const { contentId } = params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    userId: Joi.number().allow(null),
    content: Joi.string().min(1).trim().required()
  }).validate({ ...params, userId, ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    // TODO: Cek user ada
    let currUser = await User.findByPk(userId)
    if (!currUser) {
      res = { message: responseString.USER.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }
    // TODO: Cek content ada
    let currContent = await Content.findByPk(contentId)
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }
    // TODO: Cek syarat, dll untuk comment (nanti aja)
    // TODO: Add ke database
    let newComment = Comment.build({
      content: req.content,
      contentRef: currContent.id,
      authorRef: currUser.id
    })

    return await newComment
      .save()
      .then(async resp => {
        await newComment.reload({
          include: {
            model: User,
            attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
          },
          attributes: ['id', 'content', 'createdAt']
        })
        res = {
          message: responseString.GLOBAL.SUCCESS,
          created: {
            ...newComment.dataValues
          }
        }
        return Response.json(res, { status: 200 })
      })
      .catch(error => {
        res = { error: { message: responseString.GLOBAL.ADD_FAILED }, details: error }
        return Response.json(res, { status: 400 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
