import { cookies as next_cookies } from "next/headers"
import { cache } from "react"
import { AUTH_COOKIE } from "../constant"
import { verify } from "hono/jwt"
import { env } from "@/data/env"
import { Session } from "./session"

export const getSession = cache(async () => {
  const cookies = await next_cookies()
  const token = cookies.get(AUTH_COOKIE)?.value

  if (!token) return null

  const decoded = await verify(token, env.JWT_SECRET_KEY)

  if (
    typeof decoded.sub !== "string" ||
    typeof decoded.name !== "string" ||
    typeof decoded.email !== "string"
  )
    return null

  return {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email
  } as Session
})
