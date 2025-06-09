"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useQueue, type QueueTrack } from "@/contexts/queue-context"
import { toast } from "@/components/ui/use-toast"

interface AddToQueueButtonProps {
  track: QueueTrack
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function AddToQueueButton({
  track,
  variant = "outline",
  size = "sm",
  className,
  showIcon = true,
  showText = true,
}: AddToQueueButtonProps) {
  const { addToQueue } = useQueue()

  const handleAddToQueue = () => {
    addToQueue(track)
    toast({
      title: "Added to queue",
      description: `${track.title} by ${track.artist} has been added to your queue.`,
      duration: 3000,
    })
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleAddToQueue}>
      {showIcon && <PlusCircle className="h-4 w-4 mr-2" />}
      {showText && "Add to Queue"}
    </Button>
  )
}
