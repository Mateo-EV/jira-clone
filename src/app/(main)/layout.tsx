import AuthProvider from "@/features/auth/providers/AuthProvider"
import { getSession } from "@/features/auth/server/next-session"
import { redirect } from "next/navigation"

export default async function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return <AuthProvider session={session}>{children}</AuthProvider>
}
