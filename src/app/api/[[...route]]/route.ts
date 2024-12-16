import authRouter from "@/features/auth/server/route"
import workspaceRouter from "@/features/workspaces/server/route"
import { Hono } from "hono"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", authRouter)
  .route("/workspaces", workspaceRouter)

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
