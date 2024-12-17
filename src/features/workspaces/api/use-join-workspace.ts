"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { useTransitionRouter } from "next-view-transitions"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>["json"]

export function useJoinWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()
  const router = useTransitionRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({
        param: { workspaceId },
        json
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Joined workspace")
      router.push(`/workspaces/${workspaceId}`)
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to join workspace")
    }
  })
}
