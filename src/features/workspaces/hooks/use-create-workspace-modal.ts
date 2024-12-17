"use client"

import { parseAsBoolean, useQueryState } from "nuqs"

export default function useCreateWorkspaceModal() {
  const [open, setOpen] = useQueryState(
    "create-workspace",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  return { open, setOpen }
}
