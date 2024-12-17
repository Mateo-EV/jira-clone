"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { useTransitionRouter } from "next-view-transitions"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>
type RequestType = InferRequestType<typeof client.api.workspaces.$post>

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  const router = useTransitionRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data: workspace }) => {
      toast.success("Workspace created")
      router.push(`/workspaces/${workspace.id}`)
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: () => {
      toast.error("Failed to create workspace")
    }
  })
}
