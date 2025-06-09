"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useSharing } from "@/contexts/sharing-context"
import { Share2 } from "lucide-react"

interface ShareButtonProps extends ButtonProps {
  item: {
    id: string
    type: "nft" | "playlist" | "profile" | "post"
    title: string
    artist?: string
    image?: string
    url: string
  }
  iconOnly?: boolean
}

export function ShareButton({ item, iconOnly = false, ...props }: ShareButtonProps) {
  const { openShareModal } = useSharing()

  return (
    <Button variant="ghost" size={iconOnly ? "icon" : "default"} onClick={() => openShareModal(item)} {...props}>
      <Share2 className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!iconOnly && "Share"}
    </Button>
  )
}
