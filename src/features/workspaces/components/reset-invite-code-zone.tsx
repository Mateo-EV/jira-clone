import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { env } from "@/data/env"
import { useConfirm } from "@/hooks/use-confirm"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { useResetInviteCode } from "../api/use-reset-invite-code"

type ResetInviteCodeZoneProps = {
  isPending: boolean
  workspaceId: string
  inviteCode: string
}

export default function ResetInviteCodeZone({
  isPending,
  workspaceId,
  inviteCode
}: ResetInviteCodeZoneProps) {
  const fullInviteLink = `${env.NEXT_PUBLIC_URL}/workspaces/${workspaceId}/join/${inviteCode}`
  const { mutate: resetInviteCode, isPending: isResetingInviteCode } =
    useResetInviteCode(workspaceId)

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite code",
    "This will invalidate the current invite link",
    "destructive"
  )

  function handleCopyInviteLink() {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"))
  }

  async function handleResetInviteCode() {
    const ok = await confirmReset()

    if (!ok) return

    resetInviteCode()
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ResetDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Invite Members</h3>
          <p className="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input disabled value={fullInviteLink} />
              <Button
                onClick={handleCopyInviteLink}
                variant="secondary"
                className="size-12"
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>
          <DottedSeparator className="py-7" />
          <Button
            className="w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending || isResetingInviteCode}
            onClick={handleResetInviteCode}
          >
            Reset invite link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
