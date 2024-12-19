"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferResponseType } from "hono"
import { useTransitionRouter } from "next-view-transitions"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>
type GetProjectsType = InferResponseType<
  typeof client.api.projects.$get
>["data"]

export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient()
  const router = useTransitionRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param: { projectId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data: { workspaceId } }) => {
      const queryFilter = { queryKey: ["projects", workspaceId] }
      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueriesData<GetProjectsType>(queryFilter, prev => {
        if (!prev) return undefined

        return prev.filter(p => p.id !== projectId)
      })

      void queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: query => !query.state.data
      })

      router.push(`/workspaces/${workspaceId}`)
      router.refresh()
      toast.success("Project deleted")
    },
    onError: () => {
      toast.error("Failed to delete project")
    }
  })
}
