import { decomposeName } from './nextAuthUserSessionHelper'
import { getServerAuthSession } from '../configs/auth'

import User from '../models/user'

export const dynamic = 'force-dynamic'

const BYPASS = false

export async function getUserFromServerSession(req, res) {
  return new Promise(async resolve => {
    if (BYPASS) {
      const searchParams = req.nextUrl.searchParams
      const userId = searchParams.get('userId') ?? searchParams.get('creatorId') ?? null
      if (!!userId) {
        const currUser = await User.findByPk(Number(userId), {
          attributes: ['id', 'cUsername', 'email', 'role', 'displayName', 'profilePicture', 'joinDate']
        })
        if (!!currUser) {
          return resolve({
            user: { ...currUser.dataValues }
          })
        }
      }

      return resolve({
        error: {
          code: 401,
          message: 'Unauthorized!'
        }
      })
    } else {
      const session = await getServerAuthSession()
      if (!!session && !!session?.user) {
        return resolve({
          user: {
            ...decomposeName(session.user.name),
            email: session.user.email,
            profilePicture: session.user.image
          }
        })
        // const currUser = await User.findByPk(Number(session.user.id), {
        //   attributes: ['id', 'cUsername', 'email', 'role', 'displayName', 'profilePicture', 'joinDate']
        // })
        // if (!!currUser) {
        //   return resolve({
        //     user: { ...currUser.dataValues }
        //   })
        // }
      }

      return resolve({
        error: {
          code: 401,
          sessionUser: JSON.stringify(session),
          message: 'Unauthorized Session User!'
        }
      })
    }
  })
}
