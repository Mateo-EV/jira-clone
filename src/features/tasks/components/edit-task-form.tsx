"use client"

import DatePicker from "@/components/date-picker"
import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import useGetMembers from "@/features/members/api/use-get-members"
import MemberAvatar from "@/features/members/components/member-avatar"
import useGetProjects from "@/features/projects/api/use-get-projects"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import useForm from "@/hooks/use-form"
import useGetTask from "../api/use-get-task"
import useUpdateTask from "../api/use-update-task"
import { TASK_STATUS_LABELLED } from "../constant"
import { createTaskSchema } from "../schemas"

type EditTaskFormProps = {
  onCancel?: () => void
  taskId: string
}

export default function EditTaskForm({ onCancel, taskId }: EditTaskFormProps) {
  "use no memo"

  const workspaceId = useWorkspaceId()
  const { data: projects } = useGetProjects(workspaceId)
  const { data: members } = useGetMembers(workspaceId)
  const { data: task } = useGetTask(taskId, workspaceId)

  const form = useForm({
    schema: createTaskSchema.omit({ description: true }),
    defaultValues: {
      name: task.name,
      assigneeId: task.assigneeId,
      dueDate: new Date(task.dueDate),
      projectId: task.projectId,
      status: task.status
    }
  })

  const { mutate: editTask, isPending } = useUpdateTask(taskId)

  const handleSubmit = form.handleSubmit(data => {
    editTask(data, {
      onSuccess: () => {
        onCancel?.()
      }
    })
  })

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter task name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map(member => (
                          <SelectItem value={member.userId} key={member.userId}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.user.name}
                              />
                              {member.user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value?.toString() ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUS_LABELLED.map((label, value) => (
                          <SelectItem value={value.toString()} key={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      defaultValue={field.value?.toString() ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem value={project.id} key={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                image={project.image}
                                name={project.name}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={onCancel ? "visible" : "invisible"}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
