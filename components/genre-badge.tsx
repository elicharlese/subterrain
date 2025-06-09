import { Badge } from "@/components/ui/badge"
import { GenreIcon } from "@/components/genre-icon"
import { cn } from "@/lib/utils"

type GenreBadgeProps = {
  genre: string
  className?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function GenreBadge({ genre, className, variant = "secondary" }: GenreBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "font-body flex items-center",
        variant === "secondary" && "bg-black/60 hover:bg-black/80",
        className,
      )}
    >
      <GenreIcon genre={genre} size={12} />
      {genre}
    </Badge>
  )
}
