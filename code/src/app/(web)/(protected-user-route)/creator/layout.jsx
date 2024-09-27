import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/backend/configs/auth'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

export const dynamic = 'force-dynamic'

export default async function CreatorLayout({ children }) {
  const session = await getServerAuthSession()
  const user = getUserFromComposedSession(session)

  if (!user) return redirect('/auth/signIn')
  else if (user.role === 'admin') return redirect('/admin')
  else if (user.role === 'normal') return redirect('/')
  return children
}
