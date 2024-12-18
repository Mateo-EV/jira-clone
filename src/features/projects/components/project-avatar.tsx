import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/shadcn"
import Image from "next/image"

type ProjectAvatarProps = {
  image: string | null
  name: string
  className?: string
  fallbackClassName?: string
}

export default function ProjectAvatar({
  name,
  image,
  className,
  fallbackClassName
}: ProjectAvatarProps) {
  if (image)
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white rounded-md bg-blue-600 font-semibold text-sm uppercase",
          fallbackClassName
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}