"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
  itemWidth?: number
  showControls?: boolean
}

export function HorizontalScroll({ children, className, showControls = true }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScrollability()
    el.addEventListener("scroll", checkScrollability)
    window.addEventListener("resize", checkScrollability)

    return () => {
      el.removeEventListener("scroll", checkScrollability)
      window.removeEventListener("resize", checkScrollability)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = el.clientWidth * 0.75
    const newPosition = direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount

    el.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mb-4 snap-x snap-mandatory scroll-smooth",
          className,
        )}
      >
        {children}
      </div>

      {showControls && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-800/80 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity",
              !canScrollLeft && "hidden",
            )}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-800/80 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity",
              !canScrollRight && "hidden",
            )}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
