"use client"

import { client } from "@/lib/rpc"
import { useQuery } from "@tanstack/react-query"

type UseGetTasksProps = {
  workspaceId: string
  projectId?: string | null
  assigneeId?: string | null
  status?: number | null
  search?: string | null
  dueDate?: string | null
}

export default function useGetTasks(query: UseGetTasksProps) {
  return useQuery({
    queryKey: ["tasks", query],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId: query.workspaceId,
          projectId: query.projectId ?? undefined,
          assigneeId: query.assigneeId ?? undefined,
          search: query.search ?? undefined,
          status: query.status?.toString() ?? undefined,
          dueDate: query.dueDate ?? undefined
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const { data } = await response.json()
      console.log(data)

      return data
    }
  })
}
