"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferResponseType } from "hono"
import { useTransitionRouter } from "next-view-transitions"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$patch"]
>

export function useResetInviteCode(workspaceId: string) {
  const queryClient = useQueryClient()
  const router = useTransitionRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$patch"]({
        param: { workspaceId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Invite code reset")
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to reset invite code")
    }
  })
}
