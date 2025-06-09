"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface QueueTrack {
  id: number | string
  title: string
  artist: string
  audioUrl: string
  image?: string
  duration?: string
}

interface QueueContextType {
  queue: QueueTrack[]
  currentTrackIndex: number
  currentTrack: QueueTrack | null
  addToQueue: (track: QueueTrack) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  playTrack: (track: QueueTrack) => void
  nextTrack: () => void
  previousTrack: () => void
  moveTrack: (fromIndex: number, toIndex: number) => void
  playTrackAt: (index: number) => void
}

const QueueContext = createContext<QueueContextType | undefined>(undefined)

// Sample track for demo purposes
const sampleTrack: QueueTrack = {
  id: "sample-1",
  title: "Neon Dreams",
  artist: "Synthwave Collective",
  audioUrl: "/path-to-sample-audio.mp3",
  image: "/electronic-purple-album-cover.png",
  duration: "3:45",
}

export function QueueProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<QueueTrack[]>([sampleTrack])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)

  const currentTrack = currentTrackIndex >= 0 && currentTrackIndex < queue.length ? queue[currentTrackIndex] : null

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem("subterrain-queue")
      const savedIndex = localStorage.getItem("subterrain-current-track-index")

      if (savedQueue) {
        setQueue(JSON.parse(savedQueue))
      }

      if (savedIndex) {
        setCurrentTrackIndex(Number.parseInt(savedIndex, 10))
      }
    } catch (error) {
      console.error("Error loading queue from localStorage:", error)
    }
  }, [])

  // Save queue to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("subterrain-queue", JSON.stringify(queue))
      localStorage.setItem("subterrain-current-track-index", currentTrackIndex.toString())
    } catch (error) {
      console.error("Error saving queue to localStorage:", error)
    }
  }, [queue, currentTrackIndex])

  const addToQueue = useCallback((track: QueueTrack) => {
    setQueue((prev) => [...prev, track])
  }, [])

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prev) => {
        const newQueue = [...prev]
        newQueue.splice(index, 1)

        // Adjust currentTrackIndex if necessary
        if (index < currentTrackIndex) {
          setCurrentTrackIndex((prev) => prev - 1)
        } else if (index === currentTrackIndex && index >= newQueue.length) {
          setCurrentTrackIndex(newQueue.length - 1)
        }

        return newQueue
      })
    },
    [currentTrackIndex],
  )

  const clearQueue = useCallback(() => {
    setQueue([])
    setCurrentTrackIndex(-1)
  }, [])

  const playTrack = useCallback(
    (track: QueueTrack) => {
      const existingIndex = queue.findIndex((t) => t.id === track.id)

      if (existingIndex >= 0) {
        setCurrentTrackIndex(existingIndex)
      } else {
        setQueue((prev) => [...prev, track])
        setCurrentTrackIndex(queue.length)
      }
    },
    [queue],
  )

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return

    if (currentTrackIndex < queue.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1)
    } else {
      // Loop back to the beginning
      setCurrentTrackIndex(0)
    }
  }, [queue.length, currentTrackIndex])

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return

    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1)
    } else {
      // Loop to the end
      setCurrentTrackIndex(queue.length - 1)
    }
  }, [queue.length, currentTrackIndex])

  const moveTrack = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex < 0 || fromIndex >= queue.length || toIndex < 0 || toIndex >= queue.length) {
        return
      }

      setQueue((prev) => {
        const newQueue = [...prev]
        const [movedItem] = newQueue.splice(fromIndex, 1)
        newQueue.splice(toIndex, 0, movedItem)

        // Adjust currentTrackIndex if necessary
        if (currentTrackIndex === fromIndex) {
          setCurrentTrackIndex(toIndex)
        } else if (
          (fromIndex < currentTrackIndex && toIndex >= currentTrackIndex) ||
          (fromIndex > currentTrackIndex && toIndex <= currentTrackIndex)
        ) {
          setCurrentTrackIndex((prev) => (fromIndex < currentTrackIndex ? prev - 1 : prev + 1))
        }

        return newQueue
      })
    },
    [queue.length, currentTrackIndex],
  )

  const playTrackAt = useCallback(
    (index: number) => {
      if (index >= 0 && index < queue.length) {
        setCurrentTrackIndex(index)
      }
    },
    [queue.length],
  )

  return (
    <QueueContext.Provider
      value={{
        queue,
        currentTrackIndex,
        currentTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playTrack,
        nextTrack,
        previousTrack,
        moveTrack,
        playTrackAt,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const context = useContext(QueueContext)
  if (context === undefined) {
    throw new Error("useQueue must be used within a QueueProvider")
  }
  return context
}
