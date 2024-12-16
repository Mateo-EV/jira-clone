"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "../providers/AuthProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import DottedSeparator from "@/components/dotted-separator"
import { Loader2Icon, LogOutIcon } from "lucide-react"
import { useLogout } from "../api/use-logout"

export default function UserButton() {
  const user = useAuth()
  const { logout, isPending } = useLogout()

  const avatartFallback = user.name.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatartFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 font-medium text-xl text-neutral-500 flex items-center justify-center">
              {avatartFallback}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
        </div>
        <DottedSeparator />
        <DropdownMenuItem
          className="h-10 flex items-center justify-center text-destructive cursor-pointer font-medium"
          onClick={e => {
            e.preventDefault()
            logout()
          }}
        >
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <LogOutIcon />
          )}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
