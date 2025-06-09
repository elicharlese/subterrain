import Link from "next/link"
import { FileMusic, Twitter, Instagram, Youtube, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-zinc-800">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FileMusic className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold">SubTerrain</span>
            </div>
            <p className="text-zinc-400 mb-6 max-w-md">
              Musicians can enjoy the impact and support of the blockchain community by using NFTs to maintain their
              content in the evolving metaverse.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-500 hover:text-purple-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-purple-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-purple-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-purple-500 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <div className="space-y-3">
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Discover
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Mint NFT
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                My Music
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Marketplace
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Solana Guide
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                NFT Standards
              </Link>
              <Link href="#" className="block text-zinc-400 hover:text-purple-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} SubTerrain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
