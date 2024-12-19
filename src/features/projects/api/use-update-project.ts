"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$put"]
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$put"]
>["form"]

export default function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async form => {
      const response = await client.api.projects[":projectId"]["$put"]({
        form,
        param: { projectId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data }) => {
      const queryFilter = { queryKey: ["projects", data.workspaceId] }

      void queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey
      })

      toast.success("Project updated")
    },
    onError: () => {
      toast.error("Failed to update project")
    }
  })
}
