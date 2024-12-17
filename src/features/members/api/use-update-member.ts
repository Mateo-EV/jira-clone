"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.members)[":workspaceId"][":memberId"]["$patch"]
>
type RequestType = InferRequestType<
  (typeof client.api.members)[":workspaceId"][":memberId"]["$patch"]
>["json"]

export function useUpdateMember(memberId: string, workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.members[":workspaceId"][":memberId"][
        "$patch"
      ]({
        param: { memberId, workspaceId },
        json
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Member updated")
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] })
    },
    onError: () => {
      toast.error("Failed to update member")
    }
  })
}
