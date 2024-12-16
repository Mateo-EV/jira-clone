import SignUpCard from "@/features/auth/components/sign-up-card"
import { getSession } from "@/features/auth/server/next-session"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const user = await getSession()

  if (user) return redirect("/")

  return <SignUpCard />
}
