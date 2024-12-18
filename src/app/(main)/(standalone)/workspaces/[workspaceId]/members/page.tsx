import { getSession } from "@/features/auth/server/next-session"
import MembersList from "@/features/members/components/members-list"
import {
  getMemberByUserAndWorkspace,
  getMembersWithUserByWorkspace
} from "@/features/members/service"
import { getQueryClient } from "@/lib/query"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound, redirect } from "next/navigation"

export default async function WorkspaceMembersPage({
  params
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const { workspaceId } = await params

  const member = await getMemberByUserAndWorkspace(session.id, workspaceId)

  if (!member) return notFound()

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => await getMembersWithUserByWorkspace(workspaceId)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full lg:max-w-xl">
        <MembersList workspaceId={workspaceId} />
      </div>
    </HydrationBoundary>
  )
}
