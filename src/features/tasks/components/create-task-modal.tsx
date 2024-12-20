"use client"

import ResponsiveModal from "@/components/responsive-modal"
import useCreateTaskModal from "../hooks/use-create-task-modal"
import { Suspense } from "react"
import CreateTaskForm from "./create-task-form"
import CreateTaskFormSkeleton from "./create-task-form-skeleton"

export default function CreateTaskModal() {
  const { open, setOpen } = useCreateTaskModal()

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <Suspense fallback={<CreateTaskFormSkeleton />}>
        <CreateTaskForm onCancel={() => setOpen(false)} />
      </Suspense>
    </ResponsiveModal>
  )
}
