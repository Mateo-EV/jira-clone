import UserButton from "@/features/auth/components/user-button"
import AuthProvider from "@/features/auth/providers/AuthProvider"
import { getSession } from "@/features/auth/server/next-session"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function StandaloneLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return (
    <AuthProvider session={session}>
      <main className="bg-neutral-100 min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-4">
          <nav className="flex justify-between items-center h-[73px]">
            <Link href="/">
              <Image src="/logo.svg" alt="logo" height={56} width={152} />
            </Link>
            <UserButton />
          </nav>
          <div className="flex flex-col items-center justify-center py-4">
            {children}
          </div>
        </div>
      </main>
    </AuthProvider>
  )
}
