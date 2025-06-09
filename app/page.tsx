"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MusicHero } from "@/components/music-hero"
import { FeatureSection } from "@/components/feature-section"
import { HowItWorks } from "@/components/how-it-works"
import { RecentReleases } from "@/components/recent-releases"
import { Footer } from "@/components/footer"
import { ArrowRight, Menu, X, Play } from "lucide-react"
import { useDemo } from "@/contexts/demo-context"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { startDemoMode } = useDemo()

  const handleDemoClick = () => {
    console.log("Starting demo mode...")
    startDemoMode()
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/vinyl-record-texture.png"
              alt="SubTerrain Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">SubTerrain</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#releases" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Releases
            </Link>
            <Button
              onClick={handleDemoClick}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Try Demo
            </Button>
            <Link href="/auth/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <ModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-b border-zinc-800">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#releases"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Releases
              </Link>
              <Button
                onClick={() => {
                  handleDemoClick()
                  setMobileMenuOpen(false)
                }}
                variant="outline"
                className="justify-start px-2 border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Try Demo
              </Button>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <MusicHero />

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-black to-zinc-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Music on the Blockchain?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
              Join SubTerrain today and discover a new way to connect with music and artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/auth/signup">
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                onClick={handleDemoClick}
                size="lg"
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Play className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-zinc-900">
          <FeatureSection />
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-black">
          <HowItWorks />
        </section>

        {/* Recent Releases */}
        <section id="releases" className="py-20 bg-zinc-900">
          <RecentReleases />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
