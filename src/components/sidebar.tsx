import WorkspaceSwitcher from "@/features/workspaces/components/workspace-switcher"
import { Link } from "next-view-transitions"
import Image from "next/image"
import DottedSeparator from "./dotted-separator"
import Navigation from "./navigation"
import { Suspense } from "react"
import { Skeleton } from "./ui/skeleton"
import SidebarProjects from "@/features/projects/components/sidebar-projects"

export default function Sidebar() {
  return (
    <aside className="bg-neutral-100 p-4 size-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <Suspense fallback={<Skeleton className="h-14 w-full" />}>
        <WorkspaceSwitcher />
      </Suspense>
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Suspense fallback={<Skeleton className="h-14 w-full" />}>
        <SidebarProjects />
      </Suspense>
    </aside>
  )
}
