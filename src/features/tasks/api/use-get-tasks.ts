"use client"

import { client } from "@/lib/rpc"
import { useQuery } from "@tanstack/react-query"

type UseGetTasksProps = {
  workspaceId: string
  projectId?: string
  assigneeId?: string
  status?: string
  search?: string
  dueDate?: string
}

export default function useGetTasks(query: UseGetTasksProps) {
  return useQuery({
    queryKey: ["tasks", query],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const { data } = await response.json()

      return data
    }
  })
}
