"use client"

import { client } from "@/lib/rpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function useGetTask(taskId: string, workspaceId: string) {
  return useSuspenseQuery({
    queryKey: ["tasks", { workspaceId }, taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const { data } = await response.json()

      return data
    }
  })
}
