import { client } from "@/lib/rpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function useGetMembers(workspaceId: string) {
  return useSuspenseQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } })

      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }

      const { data } = await response.json()

      return data
    }
  })
}
