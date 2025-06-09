"use client"

import { useState } from "react"
import { useUserPreferences } from "@/contexts/user-preferences-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const genres = [
  "Electronic",
  "Ambient",
  "Experimental",
  "Hip Hop",
  "Jazz",
  "Classical",
  "Rock",
  "Pop",
  "R&B",
  "Soul",
  "Funk",
  "Reggae",
  "Folk",
  "Country",
  "Metal",
  "Punk",
  "Blues",
  "World",
  "Latin",
  "Indie",
]

export default function PreferencesPage() {
  const { preferences, updatePreference, resetPreferences } = useUserPreferences()
  const [newGenre, setNewGenre] = useState<string>("")

  const handleAddGenre = (genre: string) => {
    if (genre && !preferences.preferredGenres.includes(genre.toLowerCase())) {
      updatePreference("preferredGenres", [...preferences.preferredGenres, genre.toLowerCase()])
    }
    setNewGenre("")
  }

  const handleRemoveGenre = (genre: string) => {
    updatePreference(
      "preferredGenres",
      preferences.preferredGenres.filter((g) => g !== genre),
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <Button variant="outline" onClick={resetPreferences}>
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="playback">Playback</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <Select value={preferences.theme} onValueChange={(value) => updatePreference("theme", value as any)}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="midnight">Midnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Select
                    value={preferences.accentColor}
                    onValueChange={(value) => updatePreference("accentColor", value as any)}
                  >
                    <SelectTrigger id="accentColor">
                      <SelectValue placeholder="Select accent color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="musicViewMode">Music View Mode</Label>
                  <Select
                    value={preferences.musicViewMode}
                    onValueChange={(value) => updatePreference("musicViewMode", value as any)}
                  >
                    <SelectTrigger id="musicViewMode">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showAlbumArt">Show Album Art</Label>
                  <Switch
                    id="showAlbumArt"
                    checked={preferences.showAlbumArt}
                    onCheckedChange={(checked) => updatePreference("showAlbumArt", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animationsEnabled">Enable Animations</Label>
                  <Switch
                    id="animationsEnabled"
                    checked={preferences.animationsEnabled}
                    onCheckedChange={(checked) => updatePreference("animationsEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="playback">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Playback Settings</CardTitle>
                <CardDescription>Customize how music plays in the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="playerVolume">Default Volume</Label>
                    <span className="text-sm text-muted-foreground">{Math.round(preferences.playerVolume * 100)}%</span>
                  </div>
                  <Slider
                    id="playerVolume"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[preferences.playerVolume]}
                    onValueChange={(value) => updatePreference("playerVolume", value[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="playerAutoplay">Autoplay</Label>
                  <Switch
                    id="playerAutoplay"
                    checked={preferences.playerAutoplay}
                    onCheckedChange={(checked) => updatePreference("playerAutoplay", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="playerCrossfade">Crossfade Between Tracks</Label>
                  <Switch
                    id="playerCrossfade"
                    checked={preferences.playerCrossfade}
                    onCheckedChange={(checked) => updatePreference("playerCrossfade", checked)}
                  />
                </div>

                {preferences.playerCrossfade && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="playerCrossfadeDuration">Crossfade Duration</Label>
                      <span className="text-sm text-muted-foreground">
                        {preferences.playerCrossfadeDuration} seconds
                      </span>
                    </div>
                    <Slider
                      id="playerCrossfadeDuration"
                      min={1}
                      max={12}
                      step={1}
                      value={[preferences.playerCrossfadeDuration]}
                      onValueChange={(value) => updatePreference("playerCrossfadeDuration", value[0])}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showLyrics">Show Lyrics When Available</Label>
                  <Switch
                    id="showLyrics"
                    checked={preferences.showLyrics}
                    onCheckedChange={(checked) => updatePreference("showLyrics", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Preferences</CardTitle>
                <CardDescription>Customize the content you see and discover</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Preferred Genres</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {preferences.preferredGenres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="capitalize">
                        {genre}
                        <button onClick={() => handleRemoveGenre(genre)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select value={newGenre} onValueChange={(value) => handleAddGenre(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres
                        .filter((genre) => !preferences.preferredGenres.includes(genre.toLowerCase()))
                        .map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="explicitContentAllowed">Allow Explicit Content</Label>
                  <Switch
                    id="explicitContentAllowed"
                    checked={preferences.explicitContentAllowed}
                    onCheckedChange={(checked) => updatePreference("explicitContentAllowed", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => updatePreference("pushNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="newReleaseNotifications">New Release Notifications</Label>
                  <Switch
                    id="newReleaseNotifications"
                    checked={preferences.newReleaseNotifications}
                    onCheckedChange={(checked) => updatePreference("newReleaseNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="artistActivityNotifications">Artist Activity Notifications</Label>
                  <Switch
                    id="artistActivityNotifications"
                    checked={preferences.artistActivityNotifications}
                    onCheckedChange={(checked) => updatePreference("artistActivityNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shareListeningActivity" className="block">
                      Share Listening Activity
                    </Label>
                    <p className="text-sm text-muted-foreground">Allow others to see what you're listening to</p>
                  </div>
                  <Switch
                    id="shareListeningActivity"
                    checked={preferences.shareListeningActivity}
                    onCheckedChange={(checked) => updatePreference("shareListeningActivity", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRecommendations" className="block">
                      Personalized Recommendations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to use your listening history for recommendations
                    </p>
                  </div>
                  <Switch
                    id="allowRecommendations"
                    checked={preferences.allowRecommendations}
                    onCheckedChange={(checked) => updatePreference("allowRecommendations", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accessibility">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>Customize the app for better accessibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reducedMotion" className="block">
                      Reduced Motion
                    </Label>
                    <p className="text-sm text-muted-foreground">Minimize animations and motion effects</p>
                  </div>
                  <Switch
                    id="reducedMotion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrast" className="block">
                      High Contrast
                    </Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="largerText" className="block">
                      Larger Text
                    </Label>
                    <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
                  </div>
                  <Switch
                    id="largerText"
                    checked={preferences.largerText}
                    onCheckedChange={(checked) => updatePreference("largerText", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
