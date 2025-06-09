import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"

// Create a Solana connection to the devnet cluster
export function createConnection() {
  // Use the devnet cluster by default
  return new Connection("https://api.devnet.solana.com")
}

// Function to get a user's SOL balance
export async function getWalletBalance(address: string) {
  try {
    const connection = createConnection()
    const publicKey = new PublicKey(address)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL // Convert lamports to SOL
  } catch (error) {
    console.error("Failed to fetch balance:", error)
    return 0
  }
}

// Function to get a user's NFTs
export async function getUserNFTs(address: string) {
  try {
    const connection = createConnection()
    const publicKey = new PublicKey(address)
    const metaplex = new Metaplex(connection)

    // Find all NFTs owned by the user
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey })

    return nfts.map((nft) => ({
      address: nft.address.toString(),
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
      image: nft.json?.image || "",
      attributes: nft.json?.attributes || [],
    }))
  } catch (error) {
    console.error("Failed to fetch NFTs:", error)
    return []
  }
}

// Function to convert and mint an audio file as an NFT
export async function mintMusicNFT(
  walletAddress: string,
  title: string,
  description: string,
  audioUri: string,
  imageUri: string,
  royaltyPercentage: number,
) {
  // In a real app, this would connect to the Solana blockchain
  // and mint the NFT using metaplex standards

  console.log("Minting music NFT:", {
    walletAddress,
    title,
    description,
    audioUri,
    imageUri,
    royaltyPercentage,
  })

  // Return a mock response for demonstration
  return {
    success: true,
    mintAddress: `${Math.random().toString(36).substring(2, 15)}xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`,
    transactionId: `${Math.random().toString(36).substring(2, 15)}27kqGpTWSXBZVPwWKK9QVRExCaJZuK8RBmoZwLcSEY6bJJ`,
  }
}
