"use client"

import { useUserProfile } from "@/contexts/user-profile-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileMusic, Users, Music, Calendar, Twitter, Instagram, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MusicAppLayout } from "@/components/music-app-layout"
import { AlbumGrid } from "@/components/album-grid"
import { LibraryList } from "@/components/library-list"
import { ShareButton } from "@/components/sharing/share-button"
import { MessageButton } from "@/components/messaging/message-button"
import { CommentList } from "@/components/comments/comment-list"

export default function ProfilePage() {
  const { userProfile, isLoading } = useUserProfile()

  if (isLoading) {
    return (
      <MusicAppLayout>
        <div className="container mx-auto py-6">
          <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />
          <div className="mt-4 h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
      </MusicAppLayout>
    )
  }

  if (!userProfile) {
    return (
      <MusicAppLayout>
        <div className="container mx-auto py-6 text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-muted-foreground">Please connect your wallet to view your profile.</p>
        </div>
      </MusicAppLayout>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <MusicAppLayout>
      <div className="relative h-full overflow-y-auto scrollbar-hide">
        {/* Cover Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-r-3xl border-t border-l border-zinc-800/80">
          <Image
            src={userProfile.coverImageUrl || "/placeholder.svg"}
            alt="Profile cover"
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 flex flex-col items-center md:flex-row md:items-end">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background">
                <Image
                  src={userProfile.avatarUrl || "/placeholder.svg"}
                  alt={userProfile.displayName}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              {userProfile.isVerified && (
                <Badge className="absolute bottom-1 right-1 bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </Badge>
              )}
            </div>

            <div className="mt-4 text-center md:ml-6 md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <h1 className="text-3xl font-bold">{userProfile.displayName}</h1>
                {userProfile.isVerified && (
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                    Verified Artist
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{userProfile.username}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{userProfile.stats.followers}</strong> Followers
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{userProfile.stats.following}</strong> Following
                  </span>
                </div>
                <div className="flex items-center">
                  <Music className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{userProfile.stats.nftsCreated}</strong> NFTs Created
                  </span>
                </div>
                <div className="flex items-center">
                  <FileMusic className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{userProfile.stats.nftsOwned}</strong> NFTs Owned
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {formatDate(userProfile.joinedDate)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-1 justify-end">
              <Button className="ml-auto">Follow</Button>
              <MessageButton
                userId={userProfile.id}
                userName={userProfile.displayName}
                userUsername={userProfile.username}
                userAvatar={userProfile.avatarUrl}
                className="ml-2"
              />
              <ShareButton
                item={{
                  id: userProfile.id,
                  type: "profile",
                  title: userProfile.displayName,
                  url: `https://subterrain.io/profile/${userProfile.username}`,
                  image: userProfile.avatarUrl,
                }}
                className="ml-2"
              />
              <Link href="/profile/edit">
                <Button variant="outline" className="ml-2">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <p className="max-w-3xl text-pretty">{userProfile.bio}</p>
          </div>

          {/* Social Links */}
          {userProfile.socialLinks && Object.keys(userProfile.socialLinks).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {userProfile.socialLinks.twitter && (
                <Link
                  href={userProfile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-full bg-accent/50 px-3 py-1 text-sm hover:bg-accent"
                >
                  <Twitter className="mr-1 h-4 w-4" />
                  Twitter
                </Link>
              )}
              {userProfile.socialLinks.instagram && (
                <Link
                  href={userProfile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-full bg-accent/50 px-3 py-1 text-sm hover:bg-accent"
                >
                  <Instagram className="mr-1 h-4 w-4" />
                  Instagram
                </Link>
              )}
              {userProfile.socialLinks.website && (
                <Link
                  href={userProfile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-full bg-accent/50 px-3 py-1 text-sm hover:bg-accent"
                >
                  <Globe className="mr-1 h-4 w-4" />
                  Website
                </Link>
              )}
            </div>
          )}

          <Separator className="my-6" />

          {/* Tabs */}
          <Tabs defaultValue="nfts" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="nfts" className="mt-6">
              <h2 className="mb-4 text-2xl font-bold">Created NFTs</h2>
              {userProfile.stats.nftsCreated > 0 ? (
                <AlbumGrid />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No NFTs created yet</h3>
                  <p className="mt-2 text-muted-foreground">Start creating your first music NFT today!</p>
                  <Link href="/mint">
                    <Button className="mt-4">Create NFT</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="playlists" className="mt-6">
              <h2 className="mb-4 text-2xl font-bold">Playlists</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Placeholder playlists */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="group overflow-hidden rounded-md border bg-card transition-all hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <Image
                        src={`/abstract-music-visualizer-${["purple", "blue", "pink", "green"][i % 4]}.png`}
                        alt={`Playlist ${i + 1}`}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Playlist {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">{10 + i} tracks</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="collection" className="mt-6">
              <h2 className="mb-4 text-2xl font-bold">NFT Collection</h2>
              {userProfile.stats.nftsOwned > 0 ? (
                <LibraryList />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No NFTs in collection</h3>
                  <p className="mt-2 text-muted-foreground">Explore and collect music NFTs to build your collection.</p>
                  <Link href="/discover">
                    <Button className="mt-4">Discover NFTs</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="comments" className="mt-6">
              <CommentList itemId={userProfile.id} itemType="profile" />
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">About</h2>
                  <p className="text-pretty">{userProfile.bio}</p>

                  <h3 className="mt-6 text-xl font-semibold">Details</h3>
                  <dl className="mt-2 space-y-2">
                    <div className="flex">
                      <dt className="w-32 font-medium">Username:</dt>
                      <dd>@{userProfile.username}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium">Joined:</dt>
                      <dd>{formatDate(userProfile.joinedDate)}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium">NFTs Created:</dt>
                      <dd>{userProfile.stats.nftsCreated}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 font-medium">NFTs Owned:</dt>
                      <dd>{userProfile.stats.nftsOwned}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-bold">Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Followers</h3>
                      <p className="mt-1 text-3xl font-bold">{userProfile.stats.followers}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Following</h3>
                      <p className="mt-1 text-3xl font-bold">{userProfile.stats.following}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">NFTs Created</h3>
                      <p className="mt-1 text-3xl font-bold">{userProfile.stats.nftsCreated}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">NFTs Owned</h3>
                      <p className="mt-1 text-3xl font-bold">{userProfile.stats.nftsOwned}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MusicAppLayout>
  )
}
