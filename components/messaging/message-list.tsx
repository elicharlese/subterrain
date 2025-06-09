"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMessaging, type Message } from "@/contexts/messaging-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageItemProps {
  message: Message
  isCurrentUser: boolean
}

function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="mt-1 text-right text-xs opacity-70">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}

interface MessageListProps {
  conversationId: string
}

export function MessageList({ conversationId }: MessageListProps) {
  const { userProfile } = useUserProfile()
  const { messages, sendMessage, markConversationAsRead } = useMessaging()
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  const conversationMessages = messages[conversationId] || []

  // Mark messages as read when conversation is opened
  useEffect(() => {
    markConversationAsRead(conversationId)
  }, [conversationId, markConversationAsRead])

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !userProfile) return

    sendMessage(conversationId, newMessage)
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {conversationMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversationMessages.map((message) => (
            <MessageItem key={message.id} message={message} isCurrentUser={message.senderId === userProfile?.id} />
          ))
        )}
        <div ref={endOfMessagesRef} />
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
