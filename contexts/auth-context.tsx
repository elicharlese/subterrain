"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { useDemo } from "@/contexts/demo-context"

type User = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  walletAddress?: string | null
  authMethod: "email" | "google" | "wallet" | "demo" | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithWallet: () => Promise<void>
  logout: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()
  const { isDemoMode } = useDemo()

  // Check for authentication on mount and when wallet changes
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      // Check if in demo mode
      if (isDemoMode) {
        setUser({
          id: "demo-user",
          name: "Demo User",
          email: "demo@subterrain.io",
          authMethod: "demo",
        })
        setIsLoading(false)
        return
      }

      // Check for stored user in localStorage
      try {
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("subterrain-user") : null
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }

      // Check wallet connection
      if (connected && publicKey) {
        const walletUser = {
          id: publicKey.toString(),
          name: `User ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
          walletAddress: publicKey.toString(),
          authMethod: "wallet" as const,
        }
        setUser(walletUser)

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("subterrain-user", JSON.stringify(walletUser))
        }

        setIsLoading(false)
        return
      }

      // No authentication found
      setUser(null)
      setIsLoading(false)
    }

    checkAuth()
  }, [isDemoMode, connected, publicKey])

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Mock authentication
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        authMethod: "email" as const,
      }

      setUser(authUser)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("subterrain-user", JSON.stringify(authUser))
      }

      router.push("/app")
    } catch (error) {
      console.error("Failed to sign in with email:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)

      // Mock Google authentication
      const googleUser = {
        id: "google-user-123",
        name: "Google User",
        email: "google-user@gmail.com",
        image: "/diverse-avatars.png",
        authMethod: "google" as const,
      }

      setUser(googleUser)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("subterrain-user", JSON.stringify(googleUser))
      }

      router.push("/app")
    } catch (error) {
      console.error("Failed to sign in with Google:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with wallet
  const signInWithWallet = async () => {
    try {
      setIsLoading(true)

      if (!connected || !publicKey) {
        throw new Error("Wallet not connected")
      }

      const walletUser = {
        id: publicKey.toString(),
        name: `User ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
        walletAddress: publicKey.toString(),
        authMethod: "wallet" as const,
      }

      setUser(walletUser)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("subterrain-user", JSON.stringify(walletUser))
      }

      router.push("/app")
    } catch (error) {
      console.error("Failed to sign in with wallet:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up with email
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)

      // Mock sign up
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        authMethod: "email" as const,
      }

      setUser(newUser)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("subterrain-user", JSON.stringify(newUser))
      }

      router.push("/app")
    } catch (error) {
      console.error("Failed to sign up:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true)

      // If authenticated with wallet
      if (connected) {
        await disconnect()
      }

      setUser(null)

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("subterrain-user")
      }

      router.push("/")
    } catch (error) {
      console.error("Failed to logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user || isDemoMode, // Consider demo mode as authenticated
        signInWithEmail,
        signInWithGoogle,
        signInWithWallet,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
