"use client"

import { SessionProvider } from "next-auth/react";

export default function NextAuthClientSessionProvider({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}