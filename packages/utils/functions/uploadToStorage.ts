// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiQWIyOTczYTI5MDUyMDViODY2YTUyRTk0ZmNlMWYzQ2NDY0U1Q2MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NjgzODg4ODA3NSwibmFtZSI6ImRvcmlzIn0.RciWEF8yZmVwqyksLsHVZKzXmcocDHJQ-tgzYA66L4k'
const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

/**
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param {string} imagePath the path to an image file
  * @param {string} name a name for the NFT
  * @param {string} description a text description for the NFT
  */
export async function storeNFT(image:any, name: string, description: string) {
   
    // call client.store, passing in the image & metadata
    return await nftstorage.store({
        image,
        name,
        description,
    })
}

export async function storeBlob(data: string) {
  const cid = await nftstorage.storeBlob(new Blob([data]))
  return cid
}

export async function storeCar(data: string) {
  console.log('storeCar')
  const someData = new Blob([data])
  const { car } = await NFTStorage.encodeBlob(someData)
  const cid = await nftstorage.storeCar(car)
  console.log('storeCar', cid)
  return cid
}