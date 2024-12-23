"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type InferResponseType } from "hono"
import { toast } from "sonner"
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>

export default function useDeleteTask(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, string>({
    mutationFn: async () => {
      const response = await client.api.tasks[":taskId"]["$delete"]({
        param: { taskId }
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

      toast.success("Task deleted")
    },
    onError: () => {
      toast.error("Failed to delete task")
    }
  })
}
