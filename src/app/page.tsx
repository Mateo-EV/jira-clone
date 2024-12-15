import { getSession } from "@/features/auth/server/next-session"
import { redirect } from "next/navigation"
import LogoutButotn from "./logout-button"

export default async function Home() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return <LogoutButotn />
}
