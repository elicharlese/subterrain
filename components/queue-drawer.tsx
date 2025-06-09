"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQueue } from "@/contexts/queue-context"
import { Play, Trash2, GripVertical, Music, X, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface QueueDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QueueDrawer({ open, onOpenChange }: QueueDrawerProps) {
  const { queue, currentTrackIndex, removeFromQueue, clearQueue, playTrackAt, moveTrack } = useQueue()

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const draggableElement = document.querySelector(`[data-index="${draggedIndex}"]`)
    const dropZone = document.querySelector(`[data-index="${index}"]`)

    if (draggableElement && dropZone) {
      // Visual feedback during drag
      dropZone.classList.add("bg-primary/10")
    }
  }

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const dropZone = document.querySelector(`[data-index="${index}"]`)
    if (dropZone) {
      dropZone.classList.remove("bg-primary/10")
    }
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    moveTrack(draggedIndex, index)
    setDraggedIndex(null)

    // Remove visual feedback
    const dropZone = document.querySelector(`[data-index="${index}"]`)
    if (dropZone) {
      dropZone.classList.remove("bg-primary/10")
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    // Clean up any remaining visual feedback
    document.querySelectorAll(".bg-primary/10").forEach((el) => {
      el.classList.remove("bg-primary/10")
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Play Queue
              </SheetTitle>
              <div className="flex items-center gap-2">
                {queue.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearQueue} className="h-8 text-xs">
                    Clear Queue
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Music className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Your queue is empty</h3>
                  <p className="text-muted-foreground text-sm max-w-[250px]">
                    Add tracks to your queue by clicking the "Add to Queue" button on any track.
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1">
                    {queue.length} {queue.length === 1 ? "track" : "tracks"} in queue
                  </div>

                  <div className="mt-2 space-y-1">
                    {queue.map((track, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        data-index={index}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={(e) => handleDragLeave(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-md group relative",
                          currentTrackIndex === index ? "bg-primary/20" : "hover:bg-accent",
                          draggedIndex === index && "opacity-50",
                        )}
                      >
                        <div
                          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={track.image || "/placeholder.svg?height=40&width=40&query=music"}
                            alt={track.title}
                            fill
                            className="object-cover"
                          />
                          {currentTrackIndex === index && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-medium text-sm truncate",
                              currentTrackIndex === index && "text-primary",
                            )}
                          >
                            {track.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => playTrackAt(index)}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromQueue(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => onOpenChange(false)}>
              <Plus className="h-4 w-4" />
              Add More Tracks
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
