"use client"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/auth/api/use-logout"

export default function LogoutButotn() {
  const { mutate: logout } = useLogout()

  return <Button onClick={() => logout()}>LogoutButotn</Button>
}
