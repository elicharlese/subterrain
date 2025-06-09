import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Headphones, Zap } from "lucide-react"

export function MusicHero() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-0"></div>
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-[url('/abstract-sound-waves-dark-purple.png')] bg-cover opacity-30 mix-blend-overlay"></div>
      </div>
      <div className="container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Own Your Sound on the Blockchain
            </h1>
            <p className="text-xl text-zinc-300 max-w-[600px] mb-8 font-body">
              Musicians can enjoy the impact and support of the blockchain community using NFTs to maintain their
              content in the evolving music industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-heading tracking-wide"
              >
                <Zap className="h-5 w-5" />
                Start Creating
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-heading tracking-wide">
                <Headphones className="h-5 w-5" />
                Discover Music
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20">
            <Image src="/placeholder-ngrsu.png" alt="Music artist in studio" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
