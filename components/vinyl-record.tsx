"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface VinylRecordProps {
  isPlaying: boolean
  albumCover: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function VinylRecord({ isPlaying, albumCover, size = "md", className }: VinylRecordProps) {
  const [rotation, setRotation] = useState(0)

  // Determine size in pixels
  const sizeMap = {
    sm: 120,
    md: 200,
    lg: 300,
  }

  const pixelSize = sizeMap[size]

  // Animate rotation when playing
  useEffect(() => {
    if (!isPlaying) return

    let animationFrame: number
    let lastTime = performance.now()
    const rotateSpeed = 0.03 // degrees per millisecond

    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      setRotation((prev) => (prev + deltaTime * rotateSpeed) % 360)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  return (
    <div
      className={cn("relative rounded-full overflow-hidden", className)}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {/* Vinyl background */}
      <div className="absolute inset-0 bg-black rounded-full">
        {/* Vinyl grooves */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[85%] h-[85%] rounded-full border border-zinc-800"></div>
          <div className="absolute w-[65%] h-[65%] rounded-full border border-zinc-800"></div>
          <div className="absolute w-[45%] h-[45%] rounded-full border border-zinc-800"></div>
          <div className="absolute w-[25%] h-[25%] rounded-full border border-zinc-800"></div>
        </div>

        {/* Center hole */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[15%] h-[15%] rounded-full bg-zinc-900 flex items-center justify-center">
            <div className="w-[30%] h-[30%] rounded-full bg-zinc-800"></div>
          </div>
        </div>

        {/* Album label (center of record) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="w-[35%] h-[35%] rounded-full overflow-hidden">
            <Image src={albumCover || "/placeholder.svg"} alt="Album cover" fill className="object-cover" />
          </div>
        </div>

        {/* Reflection highlight */}
        <div className="absolute top-[5%] left-[5%] w-[20%] h-[20%] bg-white/5 rounded-full blur-sm"></div>
      </div>
    </div>
  )
}
