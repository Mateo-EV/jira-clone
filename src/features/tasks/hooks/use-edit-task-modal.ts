import { parseAsString, useQueryState } from "nuqs"

export default function useEditTaskModal() {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString)

  const open = (id: string) => setTaskId(id)
  const close = () => setTaskId(null)

  return { open, close, taskId }
}
