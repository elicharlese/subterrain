"use client"
import type React from "react"
export const dynamic = 'force-dynamic'
import type { Metadata } from "next"
import { Space_Grotesk, Outfit } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Suspense } from "react"

// Force dynamic rendering to avoid prerendering issues with client-side contexts

// Space Grotesk for headings - has a distinctive, slightly retro feel
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

// Outfit for body text - clean but with character
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${spaceGrotesk.variable} ${outfit.variable} font-sans min-h-screen bg-background`}>
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  )
}
