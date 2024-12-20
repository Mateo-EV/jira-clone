import { z } from "zod"

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.coerce.number().int().min(0).max(4),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, "Required"),
  projectId: z.string().min(1, "Required"),
  description: z.string().nullish()
})
