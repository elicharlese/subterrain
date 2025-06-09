"use client"

import { useState } from "react"
import { useComments, type Comment } from "@/contexts/comments-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { Heart, Reply, Trash2, Send } from "lucide-react"
import Link from "next/link"

interface CommentItemProps {
  comment: Comment
  itemId: string
  onReply: (commentId: string) => void
}

function CommentItem({ comment, itemId, onReply }: CommentItemProps) {
  const { userProfile } = useUserProfile()
  const { likeComment, unlikeComment, deleteComment } = useComments()
  const [isLiked, setIsLiked] = useState(comment.isLiked)

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeComment(comment.id, itemId)
    } else {
      likeComment(comment.id, itemId)
    }
    setIsLiked(!isLiked)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(comment.id, itemId)
    }
  }

  const isAuthor = userProfile?.id === comment.authorId

  return (
    <div className="group flex gap-3 py-3">
      <Link href={`/profile/${comment.authorUsername}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.authorName} />
          <AvatarFallback>{comment.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${comment.authorUsername}`} className="font-medium hover:underline">
              {comment.authorName}
            </Link>
            <span className="text-xs text-muted-foreground">@{comment.authorUsername}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs text-muted-foreground"
            onClick={handleLikeToggle}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            {comment.likes + (isLiked !== comment.isLiked ? (isLiked ? 1 : -1) : 0)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs text-muted-foreground"
            onClick={() => onReply(comment.id)}
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </Button>
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </div>

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-2 space-y-2 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="group flex gap-3 py-2">
                <Link href={`/profile/${reply.authorUsername}`}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.authorName} />
                    <AvatarFallback>{reply.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted/30 p-2">
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${reply.authorUsername}`} className="text-sm font-medium hover:underline">
                        {reply.authorName}
                      </Link>
                      <span className="text-xs text-muted-foreground">@{reply.authorUsername}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs">{reply.content}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs text-muted-foreground"
                      onClick={() => (reply.isLiked ? unlikeComment(reply.id, itemId) : likeComment(reply.id, itemId))}
                    >
                      <Heart className={`h-3 w-3 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      {reply.likes}
                    </Button>
                    {userProfile?.id === reply.authorId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 px-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100"
                        onClick={() => deleteComment(reply.id, itemId)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentListProps {
  itemId: string
  itemType: "nft" | "playlist" | "profile" | "post"
}

export function CommentList({ itemId, itemType }: CommentListProps) {
  const { userProfile } = useUserProfile()
  const { getCommentsForItem, addComment, addReply } = useComments()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const comments = getCommentsForItem(itemId)

  const handleAddComment = () => {
    if (!newComment.trim() || !userProfile) return

    addComment(itemId, itemType, newComment)
    setNewComment("")
  }

  const handleAddReply = () => {
    if (!replyContent.trim() || !replyingTo || !userProfile) return

    addReply(replyingTo, itemId, replyContent)
    setReplyContent("")
    setReplyingTo(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

      {/* Add comment form */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} alt={userProfile?.displayName} />
          <AvatarFallback>{userProfile?.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
              <Send className="mr-2 h-4 w-4" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Reply form */}
      {replyingTo && (
        <div className="ml-11 flex gap-3">
          <div className="flex-1">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[60px] resize-none"
              autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddReply} disabled={!replyContent.trim()} size="sm">
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-1 divide-y">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} itemId={itemId} onReply={setReplyingTo} />
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
