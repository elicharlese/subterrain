import {
  Zap,
  Cloud,
  Music,
  Headphones,
  Radio,
  Waves,
  Sparkles,
  Minimize2,
  Laptop,
  Disc,
  Guitar,
  Mic2,
  Piano,
  Music2,
  TruckIcon as Trumpet,
} from "lucide-react"
import { cn } from "@/lib/utils"

type GenreIconProps = {
  genre: string
  className?: string
  size?: number
}

export function GenreIcon({ genre, className, size = 16 }: GenreIconProps) {
  // Map genres to appropriate icons
  const getIcon = () => {
    const iconProps = {
      size,
      className: cn("mr-1", className),
      "aria-hidden": true,
    }

    switch (genre.toLowerCase()) {
      case "electronic":
        return <Zap {...iconProps} />
      case "ambient":
        return <Cloud {...iconProps} />
      case "blues":
        return <Guitar {...iconProps} />
      case "lo-fi":
        return <Radio {...iconProps} />
      case "chillwave":
        return <Waves {...iconProps} />
      case "experimental":
        return <Sparkles {...iconProps} />
      case "minimal":
        return <Minimize2 {...iconProps} />
      case "synthwave":
        return <Laptop {...iconProps} />
      case "funk":
        return <Disc {...iconProps} />
      case "jazz":
        return <Trumpet {...iconProps} />
      case "rock":
        return <Guitar {...iconProps} />
      case "hip hop":
        return <Mic2 {...iconProps} />
      case "soul":
        return <Music2 {...iconProps} />
      case "classical":
        return <Piano {...iconProps} />
      case "pop":
        return <Headphones {...iconProps} />
      default:
        return <Music {...iconProps} />
    }
  }

  return getIcon()
}
