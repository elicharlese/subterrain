"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUserProfile } from "@/contexts/user-profile-context"

export type Comment = {
  id: string
  content: string
  authorId: string
  authorName: string
  authorUsername: string
  authorAvatar: string
  itemId: string // ID of the NFT, playlist, etc. being commented on
  itemType: "nft" | "playlist" | "profile" | "post"
  createdAt: Date
  likes: number
  isLiked: boolean
  replies: Comment[]
}

type CommentsContextType = {
  comments: Record<string, Comment[]> // Keyed by itemId
  isLoading: boolean
  addComment: (itemId: string, itemType: "nft" | "playlist" | "profile" | "post", content: string) => void
  deleteComment: (commentId: string, itemId: string) => void
  likeComment: (commentId: string, itemId: string) => void
  unlikeComment: (commentId: string, itemId: string) => void
  addReply: (parentCommentId: string, itemId: string, content: string) => void
  getCommentsForItem: (itemId: string) => Comment[]
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined)

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Sample comments data
const sampleComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "comment1",
      content: "This track is amazing! Love the bass line.",
      authorId: "user1",
      authorName: "Bass Hunter",
      authorUsername: "basshunter",
      authorAvatar: "/placeholder-j5so9.png",
      itemId: "1",
      itemType: "nft",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: "reply1",
          content: "I agree! The production quality is top-notch.",
          authorId: "user2",
          authorName: "Music Lover",
          authorUsername: "musiclover",
          authorAvatar: "/placeholder-t1xso.png",
          itemId: "1",
          itemType: "nft",
          createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
          likes: 3,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "comment2",
      content: "I've been waiting for this drop! Instant buy for me.",
      authorId: "user3",
      authorName: "Crypto Collector",
      authorUsername: "nftcollector",
      authorAvatar: "/placeholder-5cjxo.png",
      itemId: "1",
      itemType: "nft",
      createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
      likes: 8,
      isLiked: false,
      replies: [],
    },
  ],
  "2": [
    {
      id: "comment3",
      content: "The ambient vibes on this track are so relaxing.",
      authorId: "user4",
      authorName: "Chill Vibes",
      authorUsername: "chillvibes",
      authorAvatar: "/placeholder-4wff0.png",
      itemId: "2",
      itemType: "nft",
      createdAt: new Date(Date.now() - 3600000 * 36), // 36 hours ago
      likes: 15,
      isLiked: true,
      replies: [],
    },
  ],
}

export function CommentsProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useUserProfile()
  const [comments, setComments] = useState<Record<string, Comment[]>>(sampleComments)
  const [isLoading, setIsLoading] = useState(false)

  // Load comments from localStorage on mount
  useEffect(() => {
    const loadComments = () => {
      setIsLoading(true)
      try {
        const savedComments = localStorage.getItem("subterrain-comments")
        if (savedComments) {
          const parsedComments = JSON.parse(savedComments)

          // Convert string dates back to Date objects
          Object.keys(parsedComments).forEach((itemId) => {
            parsedComments[itemId].forEach((comment: any) => {
              comment.createdAt = new Date(comment.createdAt)
              comment.replies.forEach((reply: any) => {
                reply.createdAt = new Date(reply.createdAt)
              })
            })
          })

          setComments(parsedComments)
        }
      } catch (error) {
        console.error("Failed to load comments:", error)
      }
      setIsLoading(false)
    }

    loadComments()
  }, [])

  // Save comments to localStorage when they change
  useEffect(() => {
    localStorage.setItem("subterrain-comments", JSON.stringify(comments))
  }, [comments])

  const addComment = (itemId: string, itemType: "nft" | "playlist" | "profile" | "post", content: string) => {
    if (!userProfile) return

    const newComment: Comment = {
      id: generateId(),
      content,
      authorId: userProfile.id,
      authorName: userProfile.displayName,
      authorUsername: userProfile.username,
      authorAvatar: userProfile.avatarUrl,
      itemId,
      itemType,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setComments((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newComment],
    }))
  }

  const deleteComment = (commentId: string, itemId: string) => {
    setComments((prev) => {
      const itemComments = [...(prev[itemId] || [])]

      // Check if it's a top-level comment
      const commentIndex = itemComments.findIndex((c) => c.id === commentId)
      if (commentIndex !== -1) {
        itemComments.splice(commentIndex, 1)
        return { ...prev, [itemId]: itemComments }
      }

      // Check if it's a reply
      const updatedComments = itemComments.map((comment) => {
        const replyIndex = comment.replies.findIndex((r) => r.id === commentId)
        if (replyIndex !== -1) {
          const updatedReplies = [...comment.replies]
          updatedReplies.splice(replyIndex, 1)
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })

      return { ...prev, [itemId]: updatedComments }
    })
  }

  const likeComment = (commentId: string, itemId: string) => {
    setComments((prev) => {
      const itemComments = [...(prev[itemId] || [])]

      // Check if it's a top-level comment
      const commentIndex = itemComments.findIndex((c) => c.id === commentId)
      if (commentIndex !== -1) {
        const updatedComment = {
          ...itemComments[commentIndex],
          likes: itemComments[commentIndex].likes + 1,
          isLiked: true,
        }
        itemComments[commentIndex] = updatedComment
        return { ...prev, [itemId]: itemComments }
      }

      // Check if it's a reply
      const updatedComments = itemComments.map((comment) => {
        const replyIndex = comment.replies.findIndex((r) => r.id === commentId)
        if (replyIndex !== -1) {
          const updatedReplies = [...comment.replies]
          updatedReplies[replyIndex] = {
            ...updatedReplies[replyIndex],
            likes: updatedReplies[replyIndex].likes + 1,
            isLiked: true,
          }
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })

      return { ...prev, [itemId]: updatedComments }
    })
  }

  const unlikeComment = (commentId: string, itemId: string) => {
    setComments((prev) => {
      const itemComments = [...(prev[itemId] || [])]

      // Check if it's a top-level comment
      const commentIndex = itemComments.findIndex((c) => c.id === commentId)
      if (commentIndex !== -1) {
        const updatedComment = {
          ...itemComments[commentIndex],
          likes: Math.max(0, itemComments[commentIndex].likes - 1),
          isLiked: false,
        }
        itemComments[commentIndex] = updatedComment
        return { ...prev, [itemId]: itemComments }
      }

      // Check if it's a reply
      const updatedComments = itemComments.map((comment) => {
        const replyIndex = comment.replies.findIndex((r) => r.id === commentId)
        if (replyIndex !== -1) {
          const updatedReplies = [...comment.replies]
          updatedReplies[replyIndex] = {
            ...updatedReplies[replyIndex],
            likes: Math.max(0, updatedReplies[replyIndex].likes - 1),
            isLiked: false,
          }
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })

      return { ...prev, [itemId]: updatedComments }
    })
  }

  const addReply = (parentCommentId: string, itemId: string, content: string) => {
    if (!userProfile) return

    const newReply: Comment = {
      id: generateId(),
      content,
      authorId: userProfile.id,
      authorName: userProfile.displayName,
      authorUsername: userProfile.username,
      authorAvatar: userProfile.avatarUrl,
      itemId,
      itemType: "nft", // Default to NFT, but this could be determined by the parent
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setComments((prev) => {
      const itemComments = [...(prev[itemId] || [])]
      const updatedComments = itemComments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          }
        }
        return comment
      })

      return { ...prev, [itemId]: updatedComments }
    })
  }

  const getCommentsForItem = (itemId: string) => {
    return comments[itemId] || []
  }

  return (
    <CommentsContext.Provider
      value={{
        comments,
        isLoading,
        addComment,
        deleteComment,
        likeComment,
        unlikeComment,
        addReply,
        getCommentsForItem,
      }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentsContext)
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider")
  }
  return context
}
