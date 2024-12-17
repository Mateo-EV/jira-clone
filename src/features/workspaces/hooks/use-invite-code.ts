import { useParams } from "next/navigation"

export default function useInviteCode() {
  const params = useParams()
  return params.inviteCode as string
}
