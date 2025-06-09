"use client"

import { useState } from "react"
import { usePlaylists, type PlaylistTrack } from "@/contexts/playlist-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaylistDropzone } from "@/components/playlist-dropzone"
import { ListMusic, Plus, X, Edit, Trash2, Save, Music, Play, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PlaylistPanelProps {
  onPlayTrack: (track: PlaylistTrack) => void
  currentlyPlayingId?: number | null
  className?: string
}

export function PlaylistPanel({ onPlayTrack, currentlyPlayingId, className }: PlaylistPanelProps) {
  const {
    playlists,
    activePlaylist,
    setActivePlaylist,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    removeTrackFromPlaylist,
  } = usePlaylists()

  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setIsCreating(false)
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renamePlaylist(id, editName.trim())
      setEditingPlaylist(null)
      setEditName("")
    }
  }

  const handleDeletePlaylist = (id: string) => {
    deletePlaylist(id)
    setShowDeleteConfirm(null)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-lg font-heading font-semibold">Your Playlists</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create playlist</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isCreating && (
              <div className="flex items-center gap-2 mb-3">
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="h-9"
                  autoFocus
                />
                <Button size="sm" className="h-9" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                  Create
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            )}

            {playlists.length === 0 ? (
              <div className="text-center py-8">
                <ListMusic className="h-12 w-12 mx-auto text-zinc-700 mb-3" />
                <p className="text-zinc-400 text-sm">No playlists yet</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first playlist
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div key={playlist.id}>
                    {editingPlaylist === playlist.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Playlist name"
                          className="h-9"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => handleSaveEdit(playlist.id)}
                          disabled={!editName.trim()}
                        >
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => setEditingPlaylist(null)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <PlaylistDropzone
                        playlistId={playlist.id}
                        name={playlist.name}
                        trackCount={playlist.tracks.length}
                        isActive={activePlaylist?.id === playlist.id}
                        onClick={() => setActivePlaylist(playlist.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {activePlaylist && (
        <div className="border-t border-zinc-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold">{activePlaylist.name}</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setEditingPlaylist(activePlaylist.id)
                    setEditName(activePlaylist.name)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>

                <Dialog
                  open={showDeleteConfirm === activePlaylist.id}
                  onOpenChange={(open) => {
                    if (!open) setShowDeleteConfirm(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => setShowDeleteConfirm(activePlaylist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Playlist</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{activePlaylist.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeletePlaylist(activePlaylist.id)}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              Updated {formatDistanceToNow(new Date(activePlaylist.updatedAt), { addSuffix: true })}
            </p>

            <ScrollArea className="h-[300px]">
              {activePlaylist.tracks.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
                  <p className="text-zinc-400 text-sm">Drag albums here to add them to this playlist</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activePlaylist.tracks.map((track) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md",
                        currentlyPlayingId === track.id ? "bg-purple-900/20" : "hover:bg-zinc-800/50",
                      )}
                    >
                      <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={track.image || "/placeholder.svg"}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{track.title}</h4>
                        <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onPlayTrack(track)}>
                          <Play className="h-4 w-4" />
                          <span className="sr-only">Play</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onPlayTrack(track)}>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => removeTrackFromPlaylist(activePlaylist.id, track.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove from playlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}
