import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import User from '../models/user'
import { decomposeName } from './nextAuthUserSessionHelper'

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
      const session = await getServerSession(
        req,
        {
          ...res,
          getHeader: name => res.headers?.get(name),
          setHeader: (name, value) => res.headers?.set(name, value)
        },
        authOptions
      )
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
          sessionUser: session.user,
          message: 'Unauthorized Session User!'
        }
      })
    }
  })
}
