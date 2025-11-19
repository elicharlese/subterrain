"use client"

import { useMessaging } from "@/contexts/messaging-context"
import { MusicAppLayout } from "@/components/music-app-layout"
import { ConversationList } from "@/components/messaging/conversation-list"
import { MessageList } from "@/components/messaging/message-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"

export default function MessagesPage() {
  const { conversations, activeConversation, setActiveConversation } = useMessaging()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showMobileConversations, setShowMobileConversations] = useState(!activeConversation)

  const activeConversationData = conversations.find((conv) => conv.id === activeConversation)
  const participant = activeConversationData?.participants[0]

  // On desktop, auto-select the first conversation if none is active yet
  useEffect(() => {
    if (!isMobile && !activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0].id)
    }
  }, [isMobile, activeConversation, conversations, setActiveConversation])

  const handleBackToList = () => {
    setShowMobileConversations(true)
  }

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
    if (isMobile) {
      setShowMobileConversations(false)
    }
  }

  return (
    <MusicAppLayout>
      <div className="flex h-full min-h-0">
        {/* Conversation list - hidden on mobile when viewing a conversation */}
        {(!isMobile || showMobileConversations) && (
          <div className={`${isMobile ? "w-full" : "w-80"} border-r min-h-0`}>
            <ConversationList onSelectConversation={handleSelectConversation} />
          </div>
        )}

        {/* Message area */}
        {(!isMobile || !showMobileConversations) && (
          <div className="flex flex-1 min-h-0 flex-col">
            {activeConversation && participant ? (
              <>
                {/* Conversation header */}
                <div className="flex items-center border-b p-4">
                  {isMobile && (
                    <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackToList}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                    <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium">{participant.name}</h3>
                    <p className="text-xs text-muted-foreground">@{participant.username}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 min-h-0">
                  <MessageList conversationId={activeConversation} />
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-10 w-10 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Your Messages</h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Connect with artists and collectors. Select a conversation to start chatting.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MusicAppLayout>
  )
}
