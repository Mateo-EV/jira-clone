import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ExternalLinkIcon } from "lucide-react"

type TaskActionsProps = {
  id: string
  projectId: string
  children: React.ReactNode
}

export default function TaskActions({
  id,
  projectId,
  children
}: TaskActionsProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            disabled={false}
            onClick={() => {}}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="stroke-2" />
            Task Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
