"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUserProfile } from "@/contexts/user-profile-context"

export type Message = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date
  isRead: boolean
}

export type Conversation = {
  id: string
  participants: {
    id: string
    name: string
    username: string
    avatar: string
  }[]
  lastMessage?: {
    content: string
    createdAt: Date
    senderId: string
  }
  unreadCount: number
}

type MessagingContextType = {
  conversations: Conversation[]
  activeConversation: string | null
  messages: Record<string, Message[]> // Keyed by conversationId
  isLoading: boolean
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string) => void
  startConversation: (userId: string, userName: string, userUsername: string, userAvatar: string) => string
  markConversationAsRead: (conversationId: string) => void
  getUnreadCount: () => number
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Sample conversations and messages
const sampleConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [
      {
        id: "user1",
        name: "Bass Hunter",
        username: "basshunter",
        avatar: "/placeholder-j5so9.png",
      },
    ],
    lastMessage: {
      content: "Hey, I really loved your latest track!",
      createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      senderId: "user1",
    },
    unreadCount: 1,
  },
  {
    id: "conv2",
    participants: [
      {
        id: "user2",
        name: "Music Lover",
        username: "musiclover",
        avatar: "/placeholder-t1xso.png",
      },
    ],
    lastMessage: {
      content: "Would you be interested in a collaboration?",
      createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
      senderId: "user2",
    },
    unreadCount: 0,
  },
]

const sampleMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: "msg1",
      conversationId: "conv1",
      senderId: "user1",
      content: "Hey, I really loved your latest track!",
      createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      isRead: false,
    },
  ],
  conv2: [
    {
      id: "msg2",
      conversationId: "conv2",
      senderId: "user2",
      content: "Hi there! I'm a big fan of your music.",
      createdAt: new Date(Date.now() - 3600000 * 25), // 25 hours ago
      isRead: true,
    },
    {
      id: "msg3",
      conversationId: "conv2",
      senderId: "default-user", // Current user
      content: "Thank you so much! I appreciate your support.",
      createdAt: new Date(Date.now() - 3600000 * 24.5), // 24.5 hours ago
      isRead: true,
    },
    {
      id: "msg4",
      conversationId: "conv2",
      senderId: "user2",
      content: "Would you be interested in a collaboration?",
      createdAt: new Date(Date.now() - 3600000 * 24), // 24 hours ago
      isRead: true,
    },
  ],
}

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useUserProfile()
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(sampleMessages)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load conversations and messages from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      try {
        const savedConversations = localStorage.getItem("subterrain-conversations")
        const savedMessages = localStorage.getItem("subterrain-messages")

        if (savedConversations) {
          const parsedConversations = JSON.parse(savedConversations)

          // Convert string dates back to Date objects
          parsedConversations.forEach((conv: any) => {
            if (conv.lastMessage) {
              conv.lastMessage.createdAt = new Date(conv.lastMessage.createdAt)
            }
          })

          setConversations(parsedConversations)
        }

        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages)

          // Convert string dates back to Date objects
          Object.keys(parsedMessages).forEach((convId) => {
            parsedMessages[convId].forEach((msg: any) => {
              msg.createdAt = new Date(msg.createdAt)
            })
          })

          setMessages(parsedMessages)
        }
      } catch (error) {
        console.error("Failed to load messaging data:", error)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("subterrain-conversations", JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem("subterrain-messages", JSON.stringify(messages))
  }, [messages])

  const sendMessage = (conversationId: string, content: string) => {
    if (!userProfile) return

    const newMessage: Message = {
      id: generateId(),
      conversationId,
      senderId: userProfile.id,
      content,
      createdAt: new Date(),
      isRead: false,
    }

    // Add message to the conversation
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))

    // Update the conversation's last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                createdAt: new Date(),
                senderId: userProfile.id,
              },
            }
          : conv,
      ),
    )

    // Simulate a response after a delay (for demo purposes)
    if (conversationId === "conv1" || conversationId === "conv2") {
      setTimeout(
        () => {
          const responseContent = [
            "That sounds great!",
            "Thanks for reaching out!",
            "I'll get back to you soon.",
            "Interesting idea, let's discuss more.",
            "I appreciate your message!",
          ][Math.floor(Math.random() * 5)]

          const responseMessage: Message = {
            id: generateId(),
            conversationId,
            senderId: conversations.find((c) => c.id === conversationId)?.participants[0].id || "",
            content: responseContent,
            createdAt: new Date(),
            isRead: false,
          }

          setMessages((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), responseMessage],
          }))

          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: {
                      content: responseContent,
                      createdAt: new Date(),
                      senderId: conv.participants[0].id,
                    },
                    unreadCount: conv.unreadCount + 1,
                  }
                : conv,
            ),
          )
        },
        2000 + Math.random() * 3000,
      ) // Random delay between 2-5 seconds
    }
  }

  const startConversation = (userId: string, userName: string, userUsername: string, userAvatar: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find((conv) => conv.participants.some((p) => p.id === userId))

    if (existingConv) {
      setActiveConversation(existingConv.id)
      return existingConv.id
    }

    // Create new conversation
    const newConvId = generateId()
    const newConversation: Conversation = {
      id: newConvId,
      participants: [
        {
          id: userId,
          name: userName,
          username: userUsername,
          avatar: userAvatar,
        },
      ],
      unreadCount: 0,
    }

    setConversations((prev) => [...prev, newConversation])
    setActiveConversation(newConvId)
    return newConvId
  }

  const markConversationAsRead = (conversationId: string) => {
    // Mark all messages in the conversation as read
    setMessages((prev) => {
      const convMessages = prev[conversationId] || []
      const updatedMessages = convMessages.map((msg) => ({
        ...msg,
        isRead: true,
      }))
      return { ...prev, [conversationId]: updatedMessages }
    })

    // Reset unread count for the conversation
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
  }

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isLoading,
        setActiveConversation,
        sendMessage,
        startConversation,
        markConversationAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context = useContext(MessagingContext)
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider")
  }
  return context
}
