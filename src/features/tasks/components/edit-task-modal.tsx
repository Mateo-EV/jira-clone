"use client"

import ResponsiveModal from "@/components/responsive-modal"
import { Suspense } from "react"
import useEditTaskModal from "../hooks/use-edit-task-modal"
import CreateTaskFormSkeleton from "./create-task-form-skeleton"
import EditTaskForm from "./edit-task-form"

export default function EditTaskModal() {
  const { taskId, close } = useEditTaskModal()

  return (
    <ResponsiveModal open={Boolean(taskId)} onOpenChange={close}>
      {taskId && (
        <Suspense fallback={<CreateTaskFormSkeleton />}>
          <EditTaskForm taskId={taskId} onCancel={close} />
        </Suspense>
      )}
    </ResponsiveModal>
  )
}
