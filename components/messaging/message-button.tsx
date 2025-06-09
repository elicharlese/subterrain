"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useMessaging } from "@/contexts/messaging-context"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface MessageButtonProps extends ButtonProps {
  userId: string
  userName: string
  userUsername: string
  userAvatar: string
  iconOnly?: boolean
}

export function MessageButton({
  userId,
  userName,
  userUsername,
  userAvatar,
  iconOnly = false,
  ...props
}: MessageButtonProps) {
  const { startConversation } = useMessaging()
  const router = useRouter()

  const handleClick = () => {
    const conversationId = startConversation(userId, userName, userUsername, userAvatar)
    router.push("/messages")
  }

  return (
    <Button variant={props.variant || "outline"} size={iconOnly ? "icon" : "default"} onClick={handleClick} {...props}>
      <MessageSquare className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!iconOnly && "Message"}
    </Button>
  )
}
