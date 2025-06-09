"use client"

import { useState } from "react"
import MusicAppLayout from "@/components/music-app-layout"
import { SearchInput } from "@/components/search-input"
import { SearchResults } from "@/components/search-results"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, User2, Disc, ListMusic, Tag } from "lucide-react"
import { FeaturedCard } from "@/components/featured-card"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchHistory } from "@/hooks/use-search-history"

// Mock trending searches
const trendingSearches = [
  "blockchain beats",
  "nft music",
  "crypto funk",
  "metaverse melodies",
  "solana sounds",
  "token tunes",
]

// Mock categories for browse
const browseCategories = [
  {
    id: "electronic",
    title: "Electronic",
    image: "/electronic-music-visualization-purple.png",
  },
  {
    id: "ambient",
    title: "Ambient",
    image: "/ambient-blue-visualization.png",
  },
  {
    id: "lo-fi",
    title: "Lo-Fi",
    image: "/lofi-warm-visualization.png",
  },
  {
    id: "synthwave",
    title: "Synthwave",
    image: "/synthwave-visualization.png",
  },
  {
    id: "experimental",
    title: "Experimental",
    image: "/experimental-music-visualization-abstract.png",
  },
  {
    id: "chillwave",
    title: "Chillwave",
    image: "/chillwave-pastel-visualization.png",
  },
]

// Mock featured searches
const featuredSearches = [
  {
    id: "new-artists",
    title: "New Artists",
    description: "Discover emerging talent in the NFT music space",
    image: "/new-artists-music-visualization-purple.png",
  },
  {
    id: "top-nfts",
    title: "Top NFTs",
    description: "The most collected music NFTs this month",
    image: "/top-nfts-music-visualization-blue.png",
  },
  {
    id: "blockchain-pioneers",
    title: "Blockchain Pioneers",
    description: "Artists leading the way in blockchain music",
    image: "/blockchain-music-pioneers.png",
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const debouncedQuery = useDebounce(query, 300)
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory()

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      addToHistory(value.trim())
    }
  }

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Search</h1>

            <SearchInput
              value={query}
              onChange={handleSearch}
              onClear={() => setQuery("")}
              placeholder="Artists, songs, playlists, and more"
              className="mb-6"
              autoFocus
            />

            <ScrollArea className="h-[calc(100vh-200px)]">
              {debouncedQuery ? (
                <>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-zinc-800/50 mb-6">
                      <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
                        <Music className="h-4 w-4 mr-2" />
                        Songs
                      </TabsTrigger>
                      <TabsTrigger value="artists" className="data-[state=active]:bg-zinc-700">
                        <User2 className="h-4 w-4 mr-2" />
                        Artists
                      </TabsTrigger>
                      <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
                        <Disc className="h-4 w-4 mr-2" />
                        Albums
                      </TabsTrigger>
                      <TabsTrigger value="playlists" className="data-[state=active]:bg-zinc-700">
                        <ListMusic className="h-4 w-4 mr-2" />
                        Playlists
                      </TabsTrigger>
                      <TabsTrigger value="nfts" className="data-[state=active]:bg-zinc-700">
                        <Tag className="h-4 w-4 mr-2" />
                        NFTs
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0 space-y-8">
                      <SearchResults query={debouncedQuery} category="top" />
                      <SearchResults query={debouncedQuery} category="songs" />
                      <SearchResults query={debouncedQuery} category="artists" />
                      <SearchResults query={debouncedQuery} category="albums" />
                      <SearchResults query={debouncedQuery} category="playlists" />
                      <SearchResults query={debouncedQuery} category="nfts" />
                    </TabsContent>

                    <TabsContent value="songs" className="mt-0">
                      <SearchResults query={debouncedQuery} category="songs" showAll />
                    </TabsContent>

                    <TabsContent value="artists" className="mt-0">
                      <SearchResults query={debouncedQuery} category="artists" showAll />
                    </TabsContent>

                    <TabsContent value="albums" className="mt-0">
                      <SearchResults query={debouncedQuery} category="albums" showAll />
                    </TabsContent>

                    <TabsContent value="playlists" className="mt-0">
                      <SearchResults query={debouncedQuery} category="playlists" showAll />
                    </TabsContent>

                    <TabsContent value="nfts" className="mt-0">
                      <SearchResults query={debouncedQuery} category="nfts" showAll />
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <>
                  {/* Content when no search query */}
                  {searchHistory.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Searches</h2>
                        <button
                          onClick={clearHistory}
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((term, index) => (
                          <button
                            key={`${term}-${index}`}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full text-sm transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Trending Searches</h2>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {browseCategories.map((category) => (
                        <button key={category.id} onClick={() => setQuery(category.title)} className="text-left">
                          <div className="relative aspect-square rounded-md overflow-hidden group">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.title}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3">
                              <span className="text-white font-medium">{category.title}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Featured</h2>
                    <HorizontalScroll>
                      {featuredSearches.map((item) => (
                        <FeaturedCard
                          key={item.id}
                          title={item.title}
                          description={item.description}
                          image={item.image}
                          href={`/search?q=${encodeURIComponent(item.title)}`}
                          className="w-64"
                        />
                      ))}
                    </HorizontalScroll>
                  </div>
                </>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </MusicAppLayout>
  )
}
