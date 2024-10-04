import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/backend/configs/auth'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sign In | Panthreon',
  description: 'Sign in to your account on Panthreon'
}

export default async function ProtectedNonUserRouteLayout({ children }) {
  const session = await getServerAuthSession()
  const user = getUserFromComposedSession(session)

  if (!!user) return redirect(user.role === 'normal' ? '/home' : `/${user.role}`)
  return children
}
