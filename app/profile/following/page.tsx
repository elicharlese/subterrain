"use client"

import { useUserProfile } from "@/contexts/user-profile-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import MusicAppLayout from "@/components/music-app-layout"

export default function FollowingPage() {
  const { userProfile, isLoading, unfollowUser } = useUserProfile()

  // Mock following data
  const following = Array.from({ length: userProfile?.stats.following || 0 }, (_, i) => ({
    id: `following-${i}`,
    username: `artist${i}`,
    displayName: `Artist ${i}`,
    avatarUrl: `/placeholder-j5so9.png`,
    isVerified: i % 3 === 0, // Every 3rd user is verified
  }))

  if (isLoading) {
    return (
      <MusicAppLayout>
        <div className="container mx-auto py-6">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MusicAppLayout>
    )
  }

  if (!userProfile) {
    return (
      <MusicAppLayout>
        <div className="container mx-auto py-6 text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-muted-foreground">Please connect your wallet to view who you're following.</p>
        </div>
      </MusicAppLayout>
    )
  }

  const handleUnfollow = (id: string) => {
    unfollowUser(id)
  }

  return (
    <MusicAppLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center">
          <Link href="/profile" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Following</h1>
          <span className="ml-2 rounded-full bg-muted px-2 py-1 text-sm">{userProfile.stats.following}</span>
        </div>

        <div className="space-y-4">
          {following.length > 0 ? (
            following.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.displayName} />
                    <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{user.displayName}</h3>
                      {user.isVerified && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUnfollow(user.id)}>
                  Unfollow
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">You're not following anyone yet</h3>
              <p className="mt-2 text-muted-foreground">Discover artists and follow them to see their updates.</p>
              <Link href="/discover">
                <Button className="mt-4">Discover Artists</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MusicAppLayout>
  )
}
