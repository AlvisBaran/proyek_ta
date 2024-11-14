import Joi from 'joi'
import sqlz from '@/backend/configs/db'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import { createMail } from '@/backend/services/mail'

import User from '@/backend/models/user'
import ContentRequest from '@/backend/models/contentrequest'
import Content from '@/backend/models/content'

import '@/backend/models/association'
import ContentRequestMember from '@/backend/models/contentrequestmember'
import { getHTML } from '@/backend/services/mail/templates/main'

const ALLOWED_STATUS = ['on-progress', 'waiting-requestor-confirmation']

// ** Creator > Content Request > Set Content
export async function PUT(request, response) {
  const { id } = response.params
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    contentId: Joi.number().required()
  }).validate(req, { abortEarly: false })

  if (!joiValidate.error) {
    // * Cek Content Request Ada
    const currCR = await ContentRequest.findOne({
      where: { id, creatorRef: user.id },
      include: [
        { model: ContentRequestMember, include: { model: User, attributes: ['id', 'displayName', 'email'] } },
        { model: User, as: 'ContentRequestor', attributes: ['id', 'displayName', 'email'] },
        { model: User, as: 'ContentCreator', attributes: ['id', 'displayName', 'email'] }
      ]
    })
    if (!currCR) {
      res = { message: responseString.CONTENT_REQUEST.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek Content Request status
    if (!ALLOWED_STATUS.includes(currCR.status)) {
      res = { message: responseString.CONTENT_REQUEST.STATUS_ERROR }
      return Response.json(res, { status: 400 })
    }

    // * Cek Content Ada
    const currContent = await Content.findByPk(Number(req.contentId))
    if (!currContent) {
      res = { message: responseString.CONTENT.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    const t = await sqlz.transaction()

    try {
      // * Cek Sudah pernah di set atau belum
      if (!!currCR.contentRef) {
        // * Cek Content Lama Ada
        const oldContent = await Content.findByPk(currCR.contentRef)
        if (!!oldContent) {
          oldContent.contentRequestRef = null
          await oldContent.save({ transaction: t })
        }
      }

      // * Set Content Request ref on Content
      currContent.contentRequestRef = currCR.id
      await currContent.save({ transaction: t })

      // * Set Content ref on Content Request
      currCR.contentRef = currContent.id
      await currCR.save({ transaction: t })

      const recipients = [
        {
          name: currCR.ContentRequestor.displayName,
          address: currCR.ContentRequestor.email
        }
      ]
      currCR.ContentRequestMembers?.map(member => {
        if (!!member.User)
          recipients.push({
            name: member.User.displayName,
            address: member.User.email
          })
      })

      await createMail({
        sender: {
          name: 'Panthreon',
          address: 'no-reply@panthreon.my.id'
        },
        recipients,
        subject: 'Panthreon System Notification',
        content: getHTML({
          title: `Your content request for ${currCR.ContentCreator.displayName} is ready!`,
          subtitle: 'You can view the content preview from now and do some payment to get the full content.',
          buttonText: 'Click Here',
          buttonLink: `${process.env.SITE_URL}/request-content/${currCR.id}/detail`
        })
      })

      await t.commit()
    } catch (e) {
      await t.rollback()
      res = { message: responseString.GLOBAL.FAILED, error: e }
      return Response.json(res, { status: 400 })
    }

    // * After Success
    await currCR.reload({
      include: [
        {
          model: User,
          as: 'ContentRequestor',
          attributes: ['id', 'cUsername', 'displayName', 'email']
        },
        {
          model: Content
        }
      ]
    })
    return Response.json({ ...currCR.dataValues }, { status: 200 })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
