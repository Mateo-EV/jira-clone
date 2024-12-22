"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import useGetMembers from "@/features/members/api/use-get-members"
import useGetProjects from "@/features/projects/api/use-get-projects"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react"
import { TASK_STATUS_LABELLED } from "../constant"
import useTaskFilters from "../hooks/use-task-filter"
import DatePicker from "@/components/date-picker"

type DataFiltersProps = {
  hideProjectFilter?: boolean
}

export default function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const workspaceId = useWorkspaceId()
  const { data: projects } = useGetProjects(workspaceId)
  const { data: members } = useGetMembers(workspaceId)

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters()

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : Number(value) })
  }

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value })
  }

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : value })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status?.toString() ?? undefined}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          {TASK_STATUS_LABELLED.map((label, value) => (
            <SelectItem value={value.toString()} key={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {members.map(member => (
            <SelectItem value={member.userId} key={member.userId}>
              {member.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projects.map(project => (
            <SelectItem value={project.id} key={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={date => {
          setFilters({ dueDate: date ? date.toISOString() : null })
        }}
      />
    </div>
  )
}
