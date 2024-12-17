"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.members)[":workspaceId"][":memberId"]["$delete"]
>

export function useDeleteMember(memberId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.members[":workspaceId"][":memberId"][
        "$delete"
      ]({
        param: { memberId, workspaceId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Member deleted")
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to delete member")
    }
  })
}
