"use client"

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult
} from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import useGetTasks from "../../api/use-get-tasks"
import { TASK_STATUS_LABELLED } from "../../constant"
import KanbanCard from "./kanban-card"
import KanbanColumnHeader from "./kanban-column-header"

type DataKanbanProps = {
  data: NonNullable<ReturnType<typeof useGetTasks>["data"]>
  onChange: (tasks: { id: string; status: number; position: number }[]) => void
}

type TasksState = Array<DataKanbanProps["data"]>

export default function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TasksState>(() =>
    data
      .reduce<TasksState>(
        (acc, curr) => {
          acc[curr.status].push(curr)
          return acc
        },
        TASK_STATUS_LABELLED.map(() => [])
      )
      .map(tasks => tasks.sort((a, b) => a.position - b.position))
  )

  useEffect(() => {
    setTasks(
      data
        .reduce<TasksState>(
          (acc, curr) => {
            acc[curr.status].push(curr)
            return acc
          },
          TASK_STATUS_LABELLED.map(() => [])
        )
        .map(tasks => tasks.sort((a, b) => a.position - b.position))
    )
  }, [data])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceStatus = Number(source.droppableId)
    const destStatus = Number(destination.droppableId)

    let updatesPayload: { id: string; status: number; position: number }[] = []
    console.log("fired")

    setTasks(prevTasks => {
      const newTasks = [...prevTasks]

      const sourceColumn = [...newTasks[sourceStatus]]
      const [movedTask] = sourceColumn.splice(source.index, 1)

      if (!movedTask) return prevTasks

      const updatedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask

      newTasks[sourceStatus] = sourceColumn

      const destColumn = [...newTasks[destStatus]]
      destColumn.splice(destination.index, 0, updatedTask)
      newTasks[destStatus] = destColumn

      updatesPayload = []

      updatesPayload.push({
        id: updatedTask.id,
        status: updatedTask.status,
        position: Math.min((destination.index + 1) * 1000, 1_000_000)
      })

      newTasks[destStatus].forEach((task, index) => {
        if (task && task.id !== updatedTask.id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000)
          if (task.position !== newPosition) {
            updatesPayload.push({
              id: task.id,
              status: destStatus,
              position: newPosition
            })
          }
        }
      })

      if (sourceStatus !== destStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000)
            if (task.position !== newPosition) {
              updatesPayload.push({
                id: task.id,
                status: sourceStatus,
                position: newPosition
              })
            }
          }
        })
      }

      return newTasks
    })

    onChange(updatesPayload)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {TASK_STATUS_LABELLED.map((board, key) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-neutral-50 p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader board={board} taskCount={tasks[key].length} />
              <Droppable droppableId={key.toString()}>
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[key].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
