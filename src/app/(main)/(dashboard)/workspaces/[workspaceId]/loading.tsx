import { LoaderIcon } from "lucide-react"

export default function MainLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
