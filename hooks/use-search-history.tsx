"use client"

import { useState, useEffect } from "react"

const MAX_HISTORY_ITEMS = 10
const STORAGE_KEY = "subterrain-search-history"

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse search history:", error)
      }
    }
  }, [])

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  const addToHistory = (term: string) => {
    setSearchHistory((prev) => {
      // Remove the term if it already exists
      const filtered = prev.filter((item) => item.toLowerCase() !== term.toLowerCase())
      // Add the new term at the beginning
      const updated = [term, ...filtered]
      // Limit to MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return { searchHistory, addToHistory, clearHistory }
}
