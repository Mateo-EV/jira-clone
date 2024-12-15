"use client"

import { client } from "@/lib/rpc"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$delete()

      if (!response.ok) throw new Error("")
    },
    onSuccess: async () => {
      router.refresh()
    }
  })

  return mutation
}
