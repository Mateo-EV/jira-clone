import "server-only"

import { createMiddleware } from "hono/factory"
import { getCookie } from "hono/cookie"

import { AUTH_COOKIE } from "../constant"
import { verify } from "hono/jwt"
import { env } from "@/data/env"

export type Session = {
  id: string
  name: string
  email: string
}

type AdditionalSessionMiddlewareContext = {
  Variables: {
    user: Session
  }
}

export const sessionMiddleware =
  createMiddleware<AdditionalSessionMiddlewareContext>(async (c, next) => {
    try {
      const token = getCookie(c, AUTH_COOKIE)

      if (!token) return c.json({ error: "Unauthorized" }, 401)

      const decoded = await verify(token, env.JWT_SECRET_KEY)

      if (
        typeof decoded.sub !== "string" ||
        typeof decoded.name !== "string" ||
        typeof decoded.email !== "string"
      )
        return c.json({ error: "Unauthorized" }, 401)

      c.set("user", {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email
      })

      next()
    } catch (error) {
      console.error("Error verifying token:", error)
      return c.json({ error: "Unauthorized" }, 401)
    }
  })
