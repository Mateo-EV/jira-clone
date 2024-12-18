import { parseAsBoolean, useQueryState } from "nuqs"

export default function useCreateProjectModal() {
  const [open, setOpen] = useQueryState(
    "create-project",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  return { open, setOpen }
}
