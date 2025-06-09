"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ShareItem = {
  id: string
  type: "nft" | "playlist" | "profile" | "post"
  title: string
  artist?: string
  image?: string
  url: string
}

type SharingContextType = {
  isShareModalOpen: boolean
  currentShareItem: ShareItem | null
  openShareModal: (item: ShareItem) => void
  closeShareModal: () => void
  copyToClipboard: (text: string) => Promise<boolean>
}

const SharingContext = createContext<SharingContextType | undefined>(undefined)

export function SharingProvider({ children }: { children: ReactNode }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [currentShareItem, setCurrentShareItem] = useState<ShareItem | null>(null)

  const openShareModal = (item: ShareItem) => {
    setCurrentShareItem(item)
    setIsShareModalOpen(true)
  }

  const closeShareModal = () => {
    setIsShareModalOpen(false)
  }

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  return (
    <SharingContext.Provider
      value={{
        isShareModalOpen,
        currentShareItem,
        openShareModal,
        closeShareModal,
        copyToClipboard,
      }}
    >
      {children}
    </SharingContext.Provider>
  )
}

export function useSharing() {
  const context = useContext(SharingContext)
  if (context === undefined) {
    throw new Error("useSharing must be used within a SharingProvider")
  }
  return context
}
