"use client"

import ResponsiveModal from "@/components/responsive-modal"
import CreateProjectForm from "./create-project-form"
import useCreateProjectModal from "../hook/use-create-project-modal"

export default function CreateProjectModal() {
  const { open, setOpen } = useCreateProjectModal()

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <CreateProjectForm onCancel={() => setOpen(false)} />
    </ResponsiveModal>
  )
}
