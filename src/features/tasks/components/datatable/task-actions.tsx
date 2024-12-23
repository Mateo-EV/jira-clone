import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useConfirm } from "@/hooks/use-confirm"
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react"
import useDeleteTask from "../../api/use-delete-task"
import { useTransitionRouter } from "next-view-transitions"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import useEditTaskModal from "../../hooks/use-edit-task-modal"

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
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone",
    "destructive"
  )
  const { mutate: deleteTask, isPending } = useDeleteTask(id)

  const onDelete = async () => {
    const ok = await confirm()
    if (!ok) return

    deleteTask()
  }

  const router = useTransitionRouter()
  const workspaceId = useWorkspaceId()

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }

  const { open } = useEditTaskModal()

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={false}
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={onDelete}
            className="text-destructive focus:text-destructive font-medium p-[10px]"
          >
            <TrashIcon className="stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
