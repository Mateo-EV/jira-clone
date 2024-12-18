import { AlertTriangleIcon } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <AlertTriangleIcon className="size-6" />
      <p className="text-sm text-muted-foreground">Not found</p>
    </div>
  )
}
