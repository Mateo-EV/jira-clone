import { parseAsString, parseAsInteger, useQueryStates } from "nuqs"

export default function useTaskFilters() {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsInteger,
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString
  })
}
