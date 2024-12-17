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
          <Fragment key={member.userId}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.user.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
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
                    disabled={false}
                    onClick={() => {}}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={false}
                    onClick={() => {}}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-destructive focus:text-destructive"
                    disabled={false}
                    onClick={() => {}}
                  >
                    Remove {member.user.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < members.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
