"use client"

import type React from "react"

import { useState } from "react"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Twitter, Instagram, Globe, DiscIcon as Discord } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MusicAppLayout } from "@/components/music-app-layout"

export default function EditProfilePage() {
  const router = useRouter()
  const { userProfile, isLoading, updateProfile } = useUserProfile()

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || "",
    username: userProfile?.username || "",
    bio: userProfile?.bio || "",
    avatarUrl: userProfile?.avatarUrl || "",
    coverImageUrl: userProfile?.coverImageUrl || "",
    socialLinks: {
      twitter: userProfile?.socialLinks?.twitter || "",
      instagram: userProfile?.socialLinks?.instagram || "",
      website: userProfile?.socialLinks?.website || "",
      discord: userProfile?.socialLinks?.discord || "",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
    router.push("/profile")
  }

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
          <p className="mt-2 text-muted-foreground">Please connect your wallet to edit your profile.</p>
        </div>
      </MusicAppLayout>
    )
  }

  return (
    <MusicAppLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Cover Image */}
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg">
            <Image
              src={formData.coverImageUrl || "/placeholder.svg"}
              alt="Profile cover"
              className="object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <Button variant="secondary" size="icon" className="absolute bottom-4 right-4" type="button">
              <Camera className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-4">
              <Label htmlFor="coverImageUrl" className="text-white">
                Cover Image URL
              </Label>
              <Input
                id="coverImageUrl"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                className="mt-1 w-64 bg-background/80 backdrop-blur"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column - Avatar and Basic Info */}
            <div>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} alt={formData.displayName} />
                    <AvatarFallback className="text-2xl">
                      {formData.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    type="button"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold">Verification Status</h3>
                <div className="flex items-center rounded-md border p-4">
                  {userProfile.isVerified ? (
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-primary text-primary-foreground">
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
                      <span>Verified Artist</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Not verified. Verification is granted to established artists.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-muted-foreground">
                        @
                      </span>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} />
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-semibold">Social Links</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Twitter className="mr-2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="socialLinks.twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleChange}
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <Instagram className="mr-2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="socialLinks.instagram"
                        value={formData.socialLinks.instagram}
                        onChange={handleChange}
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="socialLinks.website"
                        value={formData.socialLinks.website}
                        onChange={handleChange}
                        placeholder="Website URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <Discord className="mr-2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="socialLinks.discord"
                        value={formData.socialLinks.discord}
                        onChange={handleChange}
                        placeholder="Discord URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </MusicAppLayout>
  )
}
