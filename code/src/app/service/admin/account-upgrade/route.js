import Joi from 'joi'

import { responseString } from '@/backend/helpers/serverResponseString'
import AccountUpgradeRequests from '@/backend/models/accountupgraderequests'
import User from '@/backend/models/user'

// Admin > Account Upgrade > Read All
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  // const restriction = searchParams.get('restriction')
  const notRespondedOnly = searchParams.get('notRespondedOnly')
  let res = {}

  // const joiValidate = Joi.object({
  //   restriction: Joi.valid("normal", "extra").optional(),
  // }).validate({restriction}, {abortEarly: false});

  // if (!joiValidate.error) {
  let requestsList = []
  let whereAttributes = {}
  // if (!restriction) restriction = 'normal';
  if (!!notRespondedOnly) whereAttributes = { ...whereAttributes, status: 'requested' }

  return await AccountUpgradeRequests.findAll({
    where: { ...whereAttributes },
    order: [['requestedAt', 'DESC']]
  })
    .then(async resps => {
      for (let i = 0; i < resps.length; i++) {
        const requestItem = resps[i]

        // Load Applicant
        let applicant = undefined
        let tempApplicant = await User.findByPk(requestItem.applicantRef)
        if (!!tempApplicant) {
          applicant = {
            ...tempApplicant.dataValues,
            password: undefined,
            saldo: undefined,
            socials: undefined,
            bio: undefined,
            about: undefined,
            banner: undefined
          }
        }

        // Load Admin If exists
        let admin = undefined
        if (!!requestItem.adminRef) {
          let tempAdmin = await User.findByPk(requestItem.adminRef)
          admin = {
            ...tempAdmin.dataValues,
            password: undefined,
            saldo: undefined,
            socials: undefined,
            bio: undefined,
            about: undefined,
            banner: undefined
          }
        }

        requestsList.push({
          ...requestItem.dataValues,
          applicant,
          admin
        })
      }
      return Response.json(requestsList, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
    })
  // }
  // else {
  //   res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details };
  //   return Response.json(res, { status: 400 });
  // }
}
