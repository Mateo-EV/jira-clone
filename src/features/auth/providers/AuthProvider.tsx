"use client"

import { createContext, useContext } from "react"
import { Session } from "../server/session"

type AuthContextProps = Session

const AuthContext = createContext<AuthContextProps>(null!)

export default function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode
  session: Session
}) {
  return <AuthContext value={session}>{children}</AuthContext>
}

export function useAuth() {
  return useContext(AuthContext)
}
