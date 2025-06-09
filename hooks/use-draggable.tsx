"use client"

import { useState, useEffect, useCallback, type RefObject } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition?: Position
  bounds?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  onDragEnd?: (position: Position) => void
}

export function useDraggable(ref: RefObject<HTMLElement>, options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, bounds = {}, onDragEnd } = options

  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<Position>(initialPosition)
  const [startPos, setStartPos] = useState<Position | null>(null)

  const handleMouseDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault()

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      setIsDragging(true)
      setStartPos({
        x: clientX - position.x,
        y: clientY - position.y,
      })
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !startPos) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      const newPosition = {
        x: clientX - startPos.x,
        y: clientY - startPos.y,
      }

      // Apply bounds if they exist
      if (bounds) {
        if (bounds.left !== undefined && newPosition.x < bounds.left) {
          newPosition.x = bounds.left
        }
        if (bounds.right !== undefined && newPosition.x > bounds.right) {
          newPosition.x = bounds.right
        }
        if (bounds.top !== undefined && newPosition.y < bounds.top) {
          newPosition.y = bounds.top
        }
        if (bounds.bottom !== undefined && newPosition.y > bounds.bottom) {
          newPosition.y = bounds.bottom
        }
      }

      setPosition(newPosition)
    },
    [isDragging, startPos, bounds],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setStartPos(null)

      if (onDragEnd) {
        onDragEnd(position)
      }
    }
  }, [isDragging, position, onDragEnd])

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault() // Prevent default drag behavior
    }

    element.addEventListener("dragstart", handleDragStart)
    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("touchstart", handleMouseDown, { passive: false })

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleMouseMove, { passive: false })
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)

    return () => {
      element.removeEventListener("dragstart", handleDragStart)
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("touchstart", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [ref, handleMouseDown, handleMouseMove, handleMouseUp])

  return {
    position,
    isDragging,
    setPosition,
  }
}
