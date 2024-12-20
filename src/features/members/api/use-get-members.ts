import { client } from "@/lib/rpc"
import { sleep } from "@/utils"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function useGetMembers(workspaceId: string) {
  return useSuspenseQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } })

      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }
      await sleep(10000)
      const { data } = await response.json()

      return data
    }
  })
}
