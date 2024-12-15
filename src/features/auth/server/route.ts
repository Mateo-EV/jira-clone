import { env } from "@/data/env"
import { zValidator } from "@hono/zod-validator"
import { hash, verify as verifyPassword } from "@node-rs/argon2"
import { createId } from "@paralleldrive/cuid2"
import { Hono } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import { AUTH_COOKIE, HASH_CONFIGURATION } from "../constant"
import { createUser, existsUserEmail, getUserByEmail } from "../data"
import { loginSchema, registerSchema } from "../schemas"
import { sessionMiddleware } from "./session"

const extraExpTime = 3600 * 24 * 15

const authRouter = new Hono()
  .post("/login", zValidator("json", loginSchema), async c => {
    const { email, password } = c.req.valid("json")

    const user = await getUserByEmail(email)

    if (!user) return c.json({ error: "Incorrect email or password" }, 400)

    const isValidPassword = await verifyPassword(
      user.password,
      password,
      HASH_CONFIGURATION
    )

    if (!isValidPassword)
      return c.json({ error: "Incorrect email or password" }, 400)

    const now = Math.floor(Date.now() / 1000)

    const token = await sign(
      {
        sub: user.id,
        name: user.name,
        email,
        iat: now,
        nbf: now,
        exp: now + extraExpTime
      },
      env.JWT_SECRET_KEY
    )

    setCookie(c, AUTH_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: extraExpTime
    })

    return c.json({ success: true })
  })
  .post("/register", zValidator("json", registerSchema), async c => {
    const { email, name, password } = c.req.valid("json")

    if (await existsUserEmail(email)) {
      return c.json({ error: "Email already exists" }, 400)
    }

    const passwordHashed = await hash(password, HASH_CONFIGURATION)

    const userId = createId()
    await createUser({ id: userId, name, email, password: passwordHashed })

    const now = Math.floor(Date.now() / 1000)

    const token = await sign(
      { sub: userId, name, email, iat: now, nbf: now, exp: now + extraExpTime },
      env.JWT_SECRET_KEY
    )

    setCookie(c, AUTH_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: extraExpTime
    })

    return c.json({ success: true })
  })
  .delete("/logout", sessionMiddleware, c => {
    deleteCookie(c, AUTH_COOKIE)

    return c.body(null)
  })

export default authRouter
