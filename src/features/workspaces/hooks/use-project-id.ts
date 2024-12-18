import { useParams } from "next/navigation"

export default function useProjectId() {
  const params = useParams()
  return params.projectId as string | undefined
}
