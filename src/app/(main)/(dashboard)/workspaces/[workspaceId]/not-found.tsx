import { AlertTriangleIcon } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="h-[calc(100vh-13rem)] gap-y-2 flex flex-col items-center justify-center">
      <AlertTriangleIcon className="size-6" />
      <p className="text-sm text-muted-foreground">Not found</p>
    </div>
  )
}
