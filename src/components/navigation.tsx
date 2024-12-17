"use client"

import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import { cn } from "@/lib/shadcn"
import { SettingsIcon, UsersIcon } from "lucide-react"
import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill
} from "react-icons/go"

const routes = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon
  }
]

export default function Navigation() {
  const workspaceId = useWorkspaceId()
  const pathname = usePathname()

  return (
    <ul className="flex flex-col">
      {routes.map(item => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`
        const isActive = pathname === fullHref
        const Icon = isActive ? item.activeIcon : item.icon

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary group transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100"
              )}
            >
              <Icon className="size-5 text-neutral-500 group-hover:text-primary transition" />
              <span>{item.label}</span>
            </div>
          </Link>
        )
      })}
    </ul>
  )
}
