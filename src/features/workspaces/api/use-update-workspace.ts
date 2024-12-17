"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$put"]
>
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$put"]
>["form"]

export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async form => {
      const response = await client.api.workspaces[":workspaceId"]["$put"]({
        form,
        param: { workspaceId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Workspace updated")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to update workspace")
    }
  })
}
