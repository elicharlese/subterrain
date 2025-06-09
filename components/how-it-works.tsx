import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to the platform to start minting and managing your music NFTs.",
    },
    {
      title: "Upload Your Music",
      description: "Upload your audio files in various formats - we'll handle the conversion and optimization.",
    },
    {
      title: "Mint as an NFT",
      description: "Convert your music into a blockchain token with customizable royalties and metadata.",
    },
    {
      title: "Share & Monetize",
      description: "Share your NFTs with fans and collectors, and start earning from your creations.",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How SubTerrain Works</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
            <Image src="/purple-sound-waves.png" alt="Music visualization" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
