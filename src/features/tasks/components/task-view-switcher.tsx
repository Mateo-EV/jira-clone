"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoaderIcon, PlusIcon } from "lucide-react"
import useCreateTaskModal from "../hooks/use-create-task-modal"
import useGetTasks from "../api/use-get-tasks"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import { useQueryState } from "nuqs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DataFilters from "./data-filters"
import useTaskFilters from "../hooks/use-task-filter"
import { DataTable } from "./datatable"
import { columns } from "./datatable/columns"

export default function TaskViewSwitcher() {
  const workspaceId = useWorkspaceId()
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table"
  })

  const [{ status, assigneeId, projectId, dueDate, search }] = useTaskFilters()

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
    search
  })

  const { setOpen } = useCreateTaskModal()

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      value={view}
      onValueChange={setView}
    >
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
        <Suspense fallback={<Skeleton className="w-full h-10" />}>
          <DataFilters />
        </Suspense>
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              Data Kanban
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Data calendar
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
