"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search",
  className,
  autoFocus = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-2xl transition-all",
        isFocused && "ring-2 ring-purple-500 rounded-md",
        className,
      )}
    >
      <div className="absolute left-3 text-zinc-400">
        <Search className="h-5 w-5" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 py-6 text-base bg-zinc-800/50 border-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <Button variant="ghost" size="icon" className="absolute right-2 h-8 w-8 hover:bg-zinc-700" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
