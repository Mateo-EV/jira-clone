import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { getSession } from "@/features/auth/server/next-session"
import { isUserMember } from "@/features/members/server/next-member"
import CreateProjectModal from "@/features/projects/components/create-project-modal"
import { getProjectsByWorkspace } from "@/features/projects/service"
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal"
import { getWorkspacesByUser } from "@/features/workspaces/service"
import { getQueryClient } from "@/lib/query"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound, redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string }>
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const { workspaceId } = await params

  const isMember = await isUserMember(workspaceId)

  if (!isMember) notFound()

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getWorkspacesByUser(session.id)
  })

  void queryClient.prefetchQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () =>
      await getProjectsByWorkspace(workspaceId, {
        id: true,
        name: true,
        image: true
      })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen">
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <div className="flex size-full">
          <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] overflow-y-auto bottom-0">
            <Sidebar />
          </div>
          <div className="lg:pl-[264px] w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Navbar />
              <main className="h-full py-8 px-6 flex flex-col">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
