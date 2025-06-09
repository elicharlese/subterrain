"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define all available user preferences with their default values
export interface UserPreferences {
  // Theme preferences
  theme: "system" | "dark" | "light" | "purple" | "midnight"
  accentColor: "purple" | "blue" | "green" | "pink" | "orange"

  // Player preferences
  playerVolume: number
  playerAutoplay: boolean
  playerCrossfade: boolean
  playerCrossfadeDuration: number

  // Display preferences
  musicViewMode: "grid" | "list" | "compact"
  showAlbumArt: boolean
  animationsEnabled: boolean
  showLyrics: boolean

  // Content preferences
  preferredGenres: string[]
  explicitContentAllowed: boolean

  // Notification preferences
  emailNotifications: boolean
  pushNotifications: boolean
  newReleaseNotifications: boolean
  artistActivityNotifications: boolean

  // Privacy preferences
  shareListeningActivity: boolean
  allowRecommendations: boolean

  // Accessibility preferences
  reducedMotion: boolean
  highContrast: boolean
  largerText: boolean
}

// Default preferences
export const defaultPreferences: UserPreferences = {
  // Theme preferences
  theme: "system",
  accentColor: "purple",

  // Player preferences
  playerVolume: 0.8,
  playerAutoplay: true,
  playerCrossfade: true,
  playerCrossfadeDuration: 3,

  // Display preferences
  musicViewMode: "grid",
  showAlbumArt: true,
  animationsEnabled: true,
  showLyrics: true,

  // Content preferences
  preferredGenres: ["electronic", "ambient", "experimental"],
  explicitContentAllowed: true,

  // Notification preferences
  emailNotifications: true,
  pushNotifications: false,
  newReleaseNotifications: true,
  artistActivityNotifications: false,

  // Privacy preferences
  shareListeningActivity: true,
  allowRecommendations: true,

  // Accessibility preferences
  reducedMotion: false,
  highContrast: false,
  largerText: false,
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  resetPreferences: () => void
  applyTheme: (theme: UserPreferences["theme"]) => void
  applyAccentColor: (color: UserPreferences["accentColor"]) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const storedPreferences = localStorage.getItem("subterrain-preferences")
        if (storedPreferences) {
          const parsedPreferences = JSON.parse(storedPreferences)
          // Merge with default preferences to ensure all fields exist
          setPreferences({ ...defaultPreferences, ...parsedPreferences })
        }
      } catch (error) {
        console.error("Failed to load preferences:", error)
      }
      setIsLoaded(true)
    }

    if (typeof window !== "undefined") {
      loadPreferences()
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("subterrain-preferences", JSON.stringify(preferences))
    }
  }, [preferences, isLoaded])

  // Apply theme preference
  useEffect(() => {
    if (!isLoaded) return

    applyTheme(preferences.theme)
  }, [preferences.theme, isLoaded])

  // Apply accent color
  useEffect(() => {
    if (!isLoaded) return

    applyAccentColor(preferences.accentColor)
  }, [preferences.accentColor, isLoaded])

  // Apply accessibility preferences
  useEffect(() => {
    if (!isLoaded) return

    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }

    // Apply high contrast preference
    if (preferences.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply larger text preference
    if (preferences.largerText) {
      document.documentElement.classList.add("larger-text")
    } else {
      document.documentElement.classList.remove("larger-text")
    }
  }, [preferences.reducedMotion, preferences.highContrast, preferences.largerText, isLoaded])

  // Update a single preference
  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences)
  }

  // Apply theme function
  const applyTheme = (theme: UserPreferences["theme"]) => {
    if (typeof window === "undefined") return

    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove("theme-dark", "theme-light", "theme-purple", "theme-midnight")

    // Apply the selected theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(`theme-${systemTheme}`)
    } else {
      root.classList.add(`theme-${theme}`)
    }
  }

  // Apply accent color function
  const applyAccentColor = (color: UserPreferences["accentColor"]) => {
    if (typeof window === "undefined") return

    const root = document.documentElement

    // Remove all accent color classes
    root.classList.remove("accent-purple", "accent-blue", "accent-green", "accent-pink", "accent-orange")

    // Apply the selected accent color
    root.classList.add(`accent-${color}`)
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
        applyTheme,
        applyAccentColor,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}
