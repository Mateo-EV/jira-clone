"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteWorkspace } from "../api/use-delete-workspace"
import DottedSeparator from "@/components/dotted-separator"

type DangerZoneProps = {
  isPending: boolean
  workspaceId: string
}

export default function DangerZone({
  isPending,
  workspaceId
}: DangerZoneProps) {
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This actions cannot be undone.",
    "destructive"
  )

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace(workspaceId)

  async function handleDelete() {
    const ok = await confirmDelete()

    if (!ok) return

    deleteWorkspace()
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>
          <DottedSeparator className="py-7" />
          <Button
            className="w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending || isDeletingWorkspace}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
