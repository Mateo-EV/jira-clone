import { parseAsBoolean, useQueryState } from "nuqs"

export default function useCreateTaskModal() {
  const [open, setOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  return { open, setOpen }
}
