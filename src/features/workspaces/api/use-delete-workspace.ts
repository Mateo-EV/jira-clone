"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferResponseType } from "hono"
import { useTransitionRouter } from "next-view-transitions"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>

export function useDeleteWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()
  const router = useTransitionRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param: { workspaceId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Workspace deleted")
      router.push("/")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to delete workspace")
    }
  })
}
