"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

type ResponseType = InferResponseType<typeof client.api.projects.$post>
type RequestType = InferRequestType<typeof client.api.projects.$post>["form"]

type GetProjectsType = InferResponseType<
  typeof client.api.projects.$get
>["data"]

export default function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async form => {
      const response = await client.api.projects.$post({
        form,
        query: { workspaceId }
      })

      if (!response.ok) {
        return Promise.reject(await response.text())
      }

      return await response.json()
    },
    onSuccess: async ({ data }) => {
      const queryFilter = { queryKey: ["projects", workspaceId] }
      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueriesData<GetProjectsType>(queryFilter, prev => {
        if (!prev) return undefined

        return [data, ...prev]
      })

      void queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: query => !query.state.data
      })

      toast.success("Project created")
    },
    onError: () => {
      toast.error("Failed to create project")
    }
  })
}
