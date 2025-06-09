"use client"

import { Button } from "@/components/ui/button"
import { GenreIcon } from "@/components/genre-icon"
import { cn } from "@/lib/utils"

type GenreFilterProps = {
  genres: string[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
  className?: string
}

export function GenreFilter({ genres, selectedGenre, onSelectGenre, className }: GenreFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          size="sm"
          className={cn(
            "font-body flex items-center",
            selectedGenre === genre
              ? "bg-purple-600 hover:bg-purple-700"
              : "hover:bg-purple-500/10 hover:text-purple-500",
          )}
          onClick={() => onSelectGenre(genre)}
        >
          {genre !== "All Genres" && (
            <GenreIcon genre={genre} className={selectedGenre === genre ? "text-white" : ""} />
          )}
          {genre}
        </Button>
      ))}
    </div>
  )
}
