"use client"

import { client } from "@/lib/rpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function useGetProjects(workspaceId: string) {
  return useSuspenseQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const { data } = await response.json()

      return data
    }
  })
}
