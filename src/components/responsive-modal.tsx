"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Drawer, DrawerContent } from "@/components/ui/drawer"
import useMediaQuery from "@/hooks/use-media-query"

type ResponsiveModalProps = {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ResponsiveModal({
  children,
  open,
  onOpenChange
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
