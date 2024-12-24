import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon
} from "lucide-react"
import { TASK_STATUS_LABELLED } from "../../constant"
import { Button } from "@/components/ui/button"
import useCreateTaskModal from "../../hooks/use-create-task-modal"

type KanbanColumnHeaderProps = {
  board: (typeof TASK_STATUS_LABELLED)[number]
  taskCount: number
}

const statusIconMap = {
  Backlog: <CircleDashedIcon className="size-[18px] text-pink-400" />,
  "In Progress": (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  "In Review": <CircleDotIcon className="size-[18px] text-blue-400" />,
  Todo: <CircleIcon className="size-[18px] text-red-400" />,
  Done: <CircleCheckIcon className="size-[18px] text-emerald-400" />
}

export default function KanbanColumnHeader({
  board,
  taskCount
}: KanbanColumnHeaderProps) {
  const icon = statusIconMap[board]
  const { setOpen } = useCreateTaskModal()

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{board}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="size-5"
      >
        <PlusIcon className="text-neutral-500" />
      </Button>
    </div>
  )
}
