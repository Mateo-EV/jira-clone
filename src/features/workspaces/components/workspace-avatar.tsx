import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/shadcn"
import Image from "next/image"

type WorkspaceAvatarProps = {
  image: string | null
  name: string
  className?: string
}

export default function WorkspaceAvatar({
  name,
  image,
  className
}: WorkspaceAvatarProps) {
  if (image)
    return (
      <div
        className={cn("size-8 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )

  return (
    <Avatar className={cn("size-8 rounded-md", className)}>
      <AvatarFallback className="text-white rounded-md bg-blue-600 font-semibold text-lg uppercase">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
