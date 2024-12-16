"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"
import Sidebar from "./sidebar"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden" size="icon">
          <MenuIcon className="text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0" aria-describedby="Sidebar">
        <SheetTitle className="sr-only">MobileSidebar</SheetTitle>
        <SheetDescription className="sr-only">
          Sidebar with more options
        </SheetDescription>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
