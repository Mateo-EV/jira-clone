"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Link } from "next-view-transitions"
import { useJoinWorkspace } from "../api/use-join-workspace"
import useWorkspaceId from "../hooks/use-workspace-id"
import useInviteCode from "../hooks/use-invite-code"

type JoinWorkspaceFormProps = {
  name: string
}

export default function JoinWorkspaceForm({ name }: JoinWorkspaceFormProps) {
  const workspaceId = useWorkspaceId()
  const inviteCode = useInviteCode()

  const { mutate: joinWorkspace, isPending } = useJoinWorkspace(workspaceId)
  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{name}</strong> workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <Button
            asChild
            variant="secondary"
            type="button"
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            onClick={() => joinWorkspace({ code: inviteCode })}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
