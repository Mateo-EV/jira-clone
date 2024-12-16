"use client"

import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export function useLogout() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$delete()

      if (!response.ok) throw new Error("")
    },
    onSuccess: () => {
      startTransition(() => {
        router.push("/sign-in")
        void queryClient.clear()
      })
    }
  })

  return { logout: mutation.mutate, isPending: mutation.isPending || isPending }
}
