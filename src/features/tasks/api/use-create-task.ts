"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.tasks.$post>
type RequestType = InferRequestType<typeof client.api.tasks.$post>["json"]

export default function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.tasks.$post({
        json
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data }) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", data.workspaceId]
      })

      toast.success("Task created")
    },
    onError: () => {
      toast.error("Failed to create task")
    }
  })
}
