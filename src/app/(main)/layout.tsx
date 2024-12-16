import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import AuthProvider from "@/features/auth/providers/AuthProvider"
import { getSession } from "@/features/auth/server/next-session"
import { getWorkspacesByUser } from "@/features/workspaces/service"
import { getQueryClient } from "@/lib/query"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"

export default async function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getWorkspacesByUser(session.id)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider session={session}>
        <div className="min-h-screen">
          <div className="flex size-full">
            <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] overflow-y-auto bottom-0">
              <Sidebar />
            </div>
            <div className="lg:pl-[264px] w-full">
              <div className="mx-auto max-w-screen-2xl h-full">
                <Navbar />
                <main className="h-full py-8 px-6 flex flex-col">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </HydrationBoundary>
  )
}
