import { AppType } from "@/app/api/[[...route]]/route"
import { env } from "@/data/env"
import { hc } from "hono/client"

export const client = hc<AppType>(env.NEXT_PUBLIC_URL)
