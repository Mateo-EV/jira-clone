"use client"

import { Button } from "@/components/ui/button"
import MemberAvatar from "@/features/members/components/member-avatar"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { client } from "@/lib/rpc"
import { type ColumnDef } from "@tanstack/react-table"
import { type InferResponseType } from "hono"
import { ArrowUpDownIcon, MoreVerticalIcon } from "lucide-react"
import TaskDate from "./task-date"
import { Badge } from "@/components/ui/badge"
import { TASK_STATUS, TASK_STATUS_LABELLED } from "../../constant"
import TaskActions from "./task-actions"

type RowData = InferResponseType<typeof client.api.tasks.$get>["data"][number]

export const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ getValue }) => {
      const name = getValue() as string

      return <p className="line-clamp-1">{name}</p>
    }
  },
  {
    accessorKey: "project.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.image}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "assignee.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate

      return <TaskDate value={dueDate} />
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDownIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge variant={TASK_STATUS[status]}>
          {TASK_STATUS_LABELLED[status]}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      const projectId = row.original.projectId

      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      )
    }
  }
]
