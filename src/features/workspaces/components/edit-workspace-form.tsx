"use client"

import DottedSeparator from "@/components/dotted-separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useForm from "@/hooks/use-form"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { useTransitionRouter } from "next-view-transitions"
import Image from "next/image"
import { useRef } from "react"
import { useUpdateWorkspace } from "../api/use-update-workspace"
import { updateWorkspaceSchema } from "../schemas"
import { getWorkspaceById } from "../service"
import DangerZone from "./danger-zone"
import ResetInviteCodeZone from "./reset-invite-code-zone"

type EditWorkspaceFormProps = {
  onCancel?: () => void
  workspace: NonNullable<Awaited<ReturnType<typeof getWorkspaceById>>>
}

export default function EditWorkspaceForm({
  onCancel,
  workspace
}: EditWorkspaceFormProps) {
  "use no memo"

  const form = useForm({
    schema: updateWorkspaceSchema,
    defaultValues: {
      name: workspace.name
    }
  })
  const router = useTransitionRouter()
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace(
    workspace.id
  )

  const handleSubmit = form.handleSubmit(({ name, image }) => {
    updateWorkspace(
      { name, image: image instanceof File ? image : "" },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspace.id}`)
        }
      }
    )
  })

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="size-full border-none shadow-none">
        <CardHeader className="flex p-7 flex-row items-center gap-x-4 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
        </CardHeader>

        <div className="px-7">
          <DottedSeparator />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <WorkspaceInputImage
                      file={field.value}
                      setFile={field.onChange}
                      isPending={isPending}
                      originalImage={workspace.image}
                    />
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={onCancel ? "visible" : "invisible"}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ResetInviteCodeZone
        isPending={isPending}
        workspaceId={workspace.id}
        inviteCode={workspace.inviteCode}
      />
      <DangerZone isPending={isPending} workspaceId={workspace.id} />
    </div>
  )
}

function WorkspaceInputImage({
  file,
  setFile,
  isPending,
  originalImage
}: {
  file: File | undefined
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  isPending: boolean
  originalImage: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null!)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setFile(file)
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-5">
        {file ? (
          <div className="size-[72px] relative rounded-md overflow-hidden">
            <Image
              src={URL.createObjectURL(file)}
              width={72}
              height={72}
              alt="workspace-image"
            />
          </div>
        ) : originalImage ? (
          <div className="size-[72px] relative rounded-md overflow-hidden">
            <Image
              src={originalImage}
              width={72}
              height={72}
              alt="workspace-image"
            />
          </div>
        ) : (
          <Avatar className="size-[72px]">
            <AvatarFallback>
              <ImageIcon />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="text-sm">Workspace Icon</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, SVG or JPEG, max 1mb
          </p>
          <input
            className="hidden"
            type="file"
            accept=".jpg, .png, .jpeg, .svg"
            onChange={handleImageChange}
            disabled={isPending}
            ref={inputRef}
          />
          <Button
            type="button"
            variant="teritary"
            disabled={isPending}
            size="xs"
            className="w-fit mt-2"
            onClick={() => inputRef.current.click()}
          >
            Upload Image
          </Button>
        </div>
      </div>
    </div>
  )
}
