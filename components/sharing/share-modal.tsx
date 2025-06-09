"use client"

import { useState } from "react"
import { useSharing } from "@/contexts/sharing-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Facebook, Twitter, Mail, Share2 } from "lucide-react"
import Image from "next/image"

export function ShareModal() {
  const { isShareModalOpen, currentShareItem, closeShareModal, copyToClipboard } = useSharing()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("social")

  if (!currentShareItem) return null

  const shareUrl = currentShareItem.url
  const shareTitle = `Check out ${currentShareItem.title} on SubTerrain Music NFT Platform`
  const shareText = currentShareItem.artist
    ? `Check out "${currentShareItem.title}" by ${currentShareItem.artist} on SubTerrain Music NFT Platform`
    : `Check out ${currentShareItem.title} on SubTerrain Music NFT Platform`

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const socialShareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      shareText,
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
      `${shareText}\n\n${shareUrl}`,
    )}`,
  }

  return (
    <Dialog open={isShareModalOpen} onOpenChange={closeShareModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {currentShareItem.type === "nft" ? "NFT" : currentShareItem.type}
          </DialogTitle>
          <DialogDescription>Share this {currentShareItem.type} with your friends and followers.</DialogDescription>
        </DialogHeader>

        {/* Item preview */}
        {currentShareItem.image && (
          <div className="flex items-center gap-3 rounded-md border p-2">
            <div className="relative h-16 w-16 overflow-hidden rounded">
              <Image
                src={currentShareItem.image || "/placeholder.svg"}
                alt={currentShareItem.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{currentShareItem.title}</h3>
              {currentShareItem.artist && <p className="text-sm text-muted-foreground">{currentShareItem.artist}</p>}
            </div>
          </div>
        )}

        <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>
          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <a
                href={socialShareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors hover:bg-muted"
              >
                <Twitter className="h-8 w-8 text-[#1DA1F2]" />
                <span className="text-sm">Twitter</span>
              </a>
              <a
                href={socialShareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors hover:bg-muted"
              >
                <Facebook className="h-8 w-8 text-[#4267B2]" />
                <span className="text-sm">Facebook</span>
              </a>
              <a
                href={socialShareLinks.email}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors hover:bg-muted"
              >
                <Mail className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm">Email</span>
              </a>
            </div>
          </TabsContent>
          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input value={shareUrl} readOnly className="h-9" />
                <p className="text-xs text-muted-foreground">
                  Copy this link to share directly with friends or on other platforms.
                </p>
              </div>
              <Button size="sm" className="px-3" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
