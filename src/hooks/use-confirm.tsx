import { useState } from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import ResponsiveModal from "@/components/responsive-modal"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export function useConfirm(
  title: string,
  message: string,
  variant: ButtonProps["variant"]
) {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  function confirm() {
    return new Promise<boolean>(resolve => {
      setPromise({ resolve })
    })
  }

  function handleClose() {
    setPromise(null)
  }

  function handleConfirm() {
    promise?.resolve(true)
    handleClose()
  }

  function handleCancel() {
    promise?.resolve(false)
    handleClose()
  }

  function ConfirmationDialog() {
    return (
      <ResponsiveModal
        open={promise !== null}
        onOpenChange={v => {
          if (!v) handleClose()
        }}
      >
        <Card className="size-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col gap-2 lg:flex-row items-center justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                variant={variant}
                className="w-full lg:w-auto"
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    )
  }

  return [ConfirmationDialog, confirm] as const
}
