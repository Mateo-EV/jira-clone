import SignInCard from "@/features/auth/components/sign-in-card"
import { getSession } from "@/features/auth/server/next-session"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const user = await getSession()

  if (user) return redirect("/")

  return <SignInCard />
}
