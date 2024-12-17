"use client"

import ResponsiveModal from "@/components/responsive-modal"
import CreateWorkspaceForm from "./create-workspace-form"
import useCreateWorkspaceModal from "../hooks/use-create-workspace-modal"

export default function CreateWorkspaceModal() {
  const { open, setOpen } = useCreateWorkspaceModal()

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <CreateWorkspaceForm onCancel={() => setOpen(false)} />
    </ResponsiveModal>
  )
}
