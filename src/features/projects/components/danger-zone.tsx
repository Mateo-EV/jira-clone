"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteProject } from "../api/use-delete-project"
import DottedSeparator from "@/components/dotted-separator"

type DangerZoneProps = {
  isPending: boolean
  projectId: string
}

export default function DangerZone({ isPending, projectId }: DangerZoneProps) {
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This actions cannot be undone.",
    "destructive"
  )

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject(projectId)

  async function handleDelete() {
    const ok = await confirmDelete()

    if (!ok) return

    deleteProject()
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a project is irreversible and will remove all associated
            data.
          </p>
          <DottedSeparator className="py-7" />
          <Button
            className="w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending || isDeletingProject}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
