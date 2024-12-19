import { z } from "zod"

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([z.instanceof(File), z.string().transform(() => undefined)])
    .optional()
})

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Minimun 1 character required"),
  image: z
    .union([z.instanceof(File), z.string().transform(() => undefined)])
    .optional()
})
