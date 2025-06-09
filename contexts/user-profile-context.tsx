"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export type UserProfile = {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  coverImageUrl: string
  socialLinks: {
    twitter?: string
    instagram?: string
    website?: string
    discord?: string
  }
  joinedDate: Date
  isVerified: boolean
  stats: {
    followers: number
    following: number
    nftsCreated: number
    nftsOwned: number
  }
}

type UserProfileContextType = {
  userProfile: UserProfile | null
  isLoading: boolean
  updateProfile: (data: Partial<UserProfile>) => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

const defaultProfile: UserProfile = {
  id: "default-user",
  username: "musiclover",
  displayName: "Music Lover",
  bio: "Just a music enthusiast exploring the world of NFT music.",
  avatarUrl: "/placeholder-j5so9.png",
  coverImageUrl: "/abstract-purple-music-visualization-widescreen.png",
  socialLinks: {
    twitter: "https://twitter.com/musiclover",
    instagram: "https://instagram.com/musiclover",
  },
  joinedDate: new Date(2023, 0, 15),
  isVerified: false,
  stats: {
    followers: 42,
    following: 128,
    nftsCreated: 0,
    nftsOwned: 7,
  },
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey } = useWallet()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user profile when wallet is connected
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)

      if (connected && publicKey) {
        // In a real app, we would fetch the user profile from a database
        // For now, we'll use a mock profile with the wallet address
        const walletAddress = publicKey.toString()

        // Check if we have a saved profile in localStorage
        const savedProfile = localStorage.getItem(`subterrain-profile-${walletAddress}`)

        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile)
            // Convert string dates back to Date objects
            parsedProfile.joinedDate = new Date(parsedProfile.joinedDate)
            setUserProfile(parsedProfile)
          } catch (error) {
            console.error("Failed to parse saved profile:", error)
            // Use default profile with wallet address
            setUserProfile({
              ...defaultProfile,
              id: walletAddress,
              username: `user${walletAddress.slice(0, 6)}`,
            })
          }
        } else {
          // Create a new profile for this wallet
          setUserProfile({
            ...defaultProfile,
            id: walletAddress,
            username: `user${walletAddress.slice(0, 6)}`,
          })
        }
      } else {
        // No wallet connected, use default profile
        setUserProfile(defaultProfile)
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [connected, publicKey])

  // Save profile to localStorage when it changes
  useEffect(() => {
    if (userProfile && connected && publicKey) {
      const walletAddress = publicKey.toString()
      localStorage.setItem(`subterrain-profile-${walletAddress}`, JSON.stringify(userProfile))
    }
  }, [userProfile, connected, publicKey])

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!userProfile) return

    setUserProfile({
      ...userProfile,
      ...data,
    })
  }

  const followUser = (userId: string) => {
    if (!userProfile) return

    // In a real app, we would call an API to follow the user
    // For now, we'll just update the local stats
    setUserProfile({
      ...userProfile,
      stats: {
        ...userProfile.stats,
        following: userProfile.stats.following + 1,
      },
    })
  }

  const unfollowUser = (userId: string) => {
    if (!userProfile) return

    // In a real app, we would call an API to unfollow the user
    // For now, we'll just update the local stats
    setUserProfile({
      ...userProfile,
      stats: {
        ...userProfile.stats,
        following: Math.max(0, userProfile.stats.following - 1),
      },
    })
  }

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        updateProfile,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
