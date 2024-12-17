import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { ViewTransitions } from "next-view-transitions"
import "./globals.css"
import QueryProvider from "@/components/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Jira-Clone",
  description: "Jira Clone modified by MateoEv"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={`${geistMono.className} antialiased`}>
          <NuqsAdapter>
            <div>
              <QueryProvider>{children}</QueryProvider>
            </div>
            <Toaster />
          </NuqsAdapter>
        </body>
      </html>
    </ViewTransitions>
  )
}
