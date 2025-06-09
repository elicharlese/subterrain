import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FeaturedCardProps {
  title: string
  description: string
  image: string
  href: string
  subtitle?: string
  className?: string
}

export function FeaturedCard({ title, description, image, href, subtitle, className }: FeaturedCardProps) {
  return (
    <Link href={href} className={cn("block w-64 flex-shrink-0", className)}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square rounded-md overflow-hidden mb-3">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        </div>
        <h3 className="font-medium text-base mb-1 group-hover:text-purple-400 transition-colors">{title}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2">{description}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
    </Link>
  )
}
