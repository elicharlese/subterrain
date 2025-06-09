import { FileMusic, Shield, Zap, CoinsIcon } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <FileMusic className="h-12 w-12 text-purple-500" />,
      title: "Custom Sounds as NFTs",
      description: "Share your custom sounds, beats, and recordings as tokens on the blockchain.",
    },
    {
      icon: <Zap className="h-12 w-12 text-purple-500" />,
      title: "Built-in File Conversion",
      description:
        "Convert your audio files directly in the app with details about the smart contract tied to your token.",
    },
    {
      icon: <Shield className="h-12 w-12 text-purple-500" />,
      title: "Secure Rights Management",
      description: "Get the rights to your content stored on a hardware wallet or ledger with blockchain verification.",
    },
    {
      icon: <CoinsIcon className="h-12 w-12 text-purple-500" />,
      title: "Instant Releases",
      description: "Share your music instantly without waiting for approvals, with signing bonuses coming soon.",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Power of a Record Label with Artist Freedom</h2>
          <p className="text-xl text-zinc-400 max-w-[800px] mx-auto">
            Take control of your music career with blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
