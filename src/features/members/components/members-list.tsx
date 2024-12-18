"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react"
import { useTransitionRouter } from "next-view-transitions"
import { Fragment } from "react"
import useGetMembers from "../api/use-get-members"
import MemberAvatar from "./member-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id"
import { useDeleteMember } from "../api/use-delete-member"
import { useUpdateMember } from "../api/use-update-member"
import { useConfirm } from "@/hooks/use-confirm"

type MembersListProps = {
  workspaceId: string
}

export default function MembersList({ workspaceId }: MembersListProps) {
  const router = useTransitionRouter()
  const { data: members } = useGetMembers(workspaceId)

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon /> Back
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members.map((member, index) => (
          <Fragment key={index}>
            <MemberItem
              name={member.user.name}
              email={member.user.email}
              memberId={member.userId}
            />
            {index < members.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

function MemberItem({
  memberId,
  name,
  email
}: {
  memberId: string
  name: string
  email: string
}) {
  const workspaceId = useWorkspaceId()
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember(
    memberId,
    workspaceId
  )
  const { mutate: updateMemberRole, isPending: isUpdatingMember } =
    useUpdateMember(memberId, workspaceId)

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be remove from the workspace",
    "destructive"
  )

  async function handleDeleteMember() {
    const ok = await confirm()
    if (!ok) return

    deleteMember()
  }

  return (
    <div className="flex items-center gap-2">
      <ConfirmDialog />
      <MemberAvatar
        name={name}
        className="size-10"
        fallbackClassName="text-lg"
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto" variant="secondary" size="icon">
            <MoreVerticalIcon className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="font-medium"
            disabled={isUpdatingMember}
            onClick={() => updateMemberRole({ role: "admin" })}
          >
            Set as Administrator
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium"
            disabled={isUpdatingMember}
            onClick={() => updateMemberRole({ role: "member" })}
          >
            Set as Member
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium text-destructive focus:text-destructive"
            disabled={isDeletingMember}
            onClick={handleDeleteMember}
          >
            Remove {name}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
