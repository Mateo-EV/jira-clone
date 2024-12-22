"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"
type ResponseType = InferResponseType<typeof client.api.tasks.$post>
type RequestType = InferRequestType<typeof client.api.tasks.$post>["json"]

export default function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, string, RequestType>({
    mutationFn: async json => {
      const response = await client.api.tasks.$post({
        json
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data: { workspaceId } }) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks"],
        predicate: ({ queryKey }) =>
          queryKey.some(
            data =>
              typeof data === "object" &&
              data !== null &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              data.workspaceId === workspaceId
          )
      })

      toast.success("Task created")
    },
    onError: e => {
      console.log(e)

      toast.error("Failed to create task")
    }
  })
}
