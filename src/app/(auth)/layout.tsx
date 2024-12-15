"use client"

import { buttonVariants } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSignIn = pathname === "/sign-in"

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" alt="logo" width={152} height={56} />
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className={buttonVariants({ variant: "secondary" })}
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  )
}
