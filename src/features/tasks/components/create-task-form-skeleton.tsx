import { Card, CardContent } from "@/components/ui/card"
import { LoaderIcon } from "lucide-react"

export default function CreateTaskFormSkeleton() {
  return (
    <Card className="w-full h-[714px] border-none shadow-none">
      <CardContent className="flex items-center justify-center h-full">
        <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  )
}
