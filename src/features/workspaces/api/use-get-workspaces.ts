"use client"

import { client } from "@/lib/rpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function useGetWorkspaces() {
  return useSuspenseQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get()

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces")
      }

      const { data } = await response.json()

      return data
    }
  })
}
