"use client"

import { useMessaging } from "@/contexts/messaging-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ConversationListProps {
  onSelectConversation?: (conversationId: string) => void
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, activeConversation, setActiveConversation } = useMessaging()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  const handleSelect = (id: string) => {
    if (onSelectConversation) {
      onSelectConversation(id)
    } else {
      setActiveConversation(id)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const participant = conversation.participants[0]
              return (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  className={`flex w-full items-start justify-start gap-3 px-4 py-3.5 text-left rounded-lg mb-1 ${
                    activeConversation === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelect(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground"
                        variant="default"
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{participant.name}</h4>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{participant.username}</p>
                    {conversation.lastMessage && (
                      <p className="truncate text-sm">
                        {conversation.lastMessage.senderId === participant.id ? "" : "You: "}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </Button>
              )
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
