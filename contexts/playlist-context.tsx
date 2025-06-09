"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type PlaylistTrack = {
  id: number
  title: string
  artist: string
  image: string
  duration: string
  audioUrl: string
}

export type Playlist = {
  id: string
  name: string
  tracks: PlaylistTrack[]
  createdAt: Date
  updatedAt: Date
  description?: string
  coverImage?: string
  isSmartPlaylist?: boolean
  smartPlaylistRules?: {
    type: "genre" | "artist" | "recent" | "mostPlayed"
    value: string
  }[]
}

type PlaylistContextType = {
  playlists: Playlist[]
  activePlaylist: Playlist | null
  createPlaylist: (name: string, description?: string) => void
  deletePlaylist: (id: string) => void
  renamePlaylist: (id: string, name: string) => void
  updatePlaylistDescription: (id: string, description: string) => void
  updatePlaylistCover: (id: string, coverImage: string) => void
  addTrackToPlaylist: (playlistId: string, track: PlaylistTrack) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: number) => void
  setActivePlaylist: (id: string | null) => void
  createSmartPlaylist: (
    name: string,
    rules: { type: "genre" | "artist" | "recent" | "mostPlayed"; value: string }[],
  ) => void
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)

  // Load playlists from localStorage on initial render
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("subterrain-playlists")
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists)
        // Convert string dates back to Date objects
        parsedPlaylists.forEach((playlist: any) => {
          playlist.createdAt = new Date(playlist.createdAt)
          playlist.updatedAt = new Date(playlist.updatedAt)
        })
        setPlaylists(parsedPlaylists)
      } catch (error) {
        console.error("Failed to parse saved playlists:", error)
      }
    } else {
      // Create default playlists if none exist
      const defaultPlaylists: Playlist[] = [
        {
          id: "default",
          name: "My First Playlist",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "My collection of favorite tracks",
        },
        {
          id: "recently-added",
          name: "Recently Added",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "Tracks added in the last 30 days",
          isSmartPlaylist: true,
          smartPlaylistRules: [{ type: "recent", value: "30" }],
        },
        {
          id: "most-played",
          name: "Most Played",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "Your most frequently played tracks",
          isSmartPlaylist: true,
          smartPlaylistRules: [{ type: "mostPlayed", value: "25" }],
        },
      ]
      setPlaylists(defaultPlaylists)
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("subterrain-playlists", JSON.stringify(playlists))
    }
  }, [playlists])

  const createPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPlaylists([...playlists, newPlaylist])
  }

  const deletePlaylist = (id: string) => {
    // Don't allow deletion of smart playlists
    const playlist = playlists.find((p) => p.id === id)
    if (playlist?.isSmartPlaylist) return

    setPlaylists(playlists.filter((playlist) => playlist.id !== id))
    if (activePlaylist?.id === id) {
      setActivePlaylist(null)
    }
  }

  const renamePlaylist = (id: string, name: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              name,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const updatePlaylistDescription = (id: string, description: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              description,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const updatePlaylistCover = (id: string, coverImage: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              coverImage,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const addTrackToPlaylist = (playlistId: string, track: PlaylistTrack) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if track already exists in playlist
          const trackExists = playlist.tracks.some((t) => t.id === track.id)
          if (trackExists) {
            return playlist
          }

          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
            updatedAt: new Date(),
          }
        }
        return playlist
      }),
    )
  }

  const removeTrackFromPlaylist = (playlistId: string, trackId: number) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: playlist.tracks.filter((track) => track.id !== trackId),
            updatedAt: new Date(),
          }
        }
        return playlist
      }),
    )
  }

  const setActivePlaylistById = (id: string | null) => {
    if (id === null) {
      setActivePlaylist(null)
      return
    }

    const playlist = playlists.find((p) => p.id === id) || null
    setActivePlaylist(playlist)
  }

  const createSmartPlaylist = (
    name: string,
    rules: { type: "genre" | "artist" | "recent" | "mostPlayed"; value: string }[],
  ) => {
    const newPlaylist: Playlist = {
      id: `smart-playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      description: `Smart playlist: ${name}`,
      isSmartPlaylist: true,
      smartPlaylistRules: rules,
    }
    setPlaylists([...playlists, newPlaylist])
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        activePlaylist,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        updatePlaylistDescription,
        updatePlaylistCover,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setActivePlaylist: setActivePlaylistById,
        createSmartPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylists() {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error("usePlaylists must be used within a PlaylistProvider")
  }
  return context
}
