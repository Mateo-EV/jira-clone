"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"
import useCreateTaskModal from "../hooks/use-create-task-modal"
import useGetTasks from "../api/use-get-tasks"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"

export default function TaskViewSwitcher() {
  const workspaceId = useWorkspaceId()
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId
  })

  const { setOpen } = useCreateTaskModal()

  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="table">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full lg:w-auto"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div>Data filters</div>
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            {JSON.stringify(tasks)}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  )
}
