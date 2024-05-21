'use client'

import { SessionProvider, useSession } from 'next-auth/react'

export default function NextAuthClientSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}

// TODO: Nanti buatin persisten auth guard untuk halaman / component yang harus ada user/session nya
// function PersistentAuthGuard() {
//   const session = useSession()

//   if (!!session.status)
// }
