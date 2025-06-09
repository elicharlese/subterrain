"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/contexts/auth-context"
import { useDemo } from "@/contexts/demo-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { FileMusic, Wallet } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const { connected, publicKey } = useWallet()
  const { signInWithEmail, signInWithGoogle, signInWithWallet } = useAuth()
  const { startDemoMode } = useDemo()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)
      await signInWithEmail(email, password)
    } catch (error) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      setError("Failed to sign in with Google")
    }
  }

  const handleWalletSignIn = async () => {
    try {
      if (!connected) {
        setVisible(true)
        return
      }

      await signInWithWallet()
    } catch (error) {
      setError("Failed to sign in with wallet")
    }
  }

  const handleDemoMode = () => {
    startDemoMode()
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <FileMusic className="h-6 w-6" />
          <span className="font-heading font-bold tracking-widest text-lg">SUBTERRAIN</span>
        </Link>
        <ModeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign In to SubTerrain</CardTitle>
            <CardDescription>Choose your preferred sign-in method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Try Demo Mode
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-400">Or sign in</span>
              </div>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>

              {/* Email Sign In */}
              <TabsContent value="email">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Google Sign In */}
              <TabsContent value="google">
                <div className="space-y-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white text-black hover:bg-white/90 flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </div>
              </TabsContent>

              {/* Wallet Sign In */}
              <TabsContent value="wallet">
                <div className="space-y-4">
                  <Button
                    onClick={handleWalletSignIn}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    {connected
                      ? `Sign in with ${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`
                      : "Connect Wallet"}
                  </Button>

                  {connected && (
                    <div className="text-center text-sm text-zinc-400">
                      <p>
                        Connected with {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                      </p>
                      <p>Click the button above to sign in with this wallet</p>
                    </div>
                  )}

                  {!connected && (
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="text-center">
                        <Image
                          src="/phantom-wallet-logo.png"
                          alt="Phantom"
                          width={40}
                          height={40}
                          className="mx-auto mb-2"
                        />
                        <p className="text-xs">Phantom</p>
                      </div>
                      <div className="text-center">
                        <Image
                          src="/solflare-wallet-logo.png"
                          alt="Solflare"
                          width={40}
                          height={40}
                          className="mx-auto mb-2"
                        />
                        <p className="text-xs">Solflare</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="mb-4" />
            <p className="text-sm text-zinc-400 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
