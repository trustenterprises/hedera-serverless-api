import { NFTStorage, Blob } from "nft.storage"
import Config from "app/config"

// Returns metadata for pinned payload
async function storeData(payload) {
	const storage = new NFTStorage({
		token: Config.nftStorageToken
	})

	// So cheeky 🕊
	const asBlob = new Blob([JSON.stringify(payload)])

	// Assume that metadata storage, like images is already handled
	try {
		return await storage.storeBlob(asBlob)
	} catch (e) {
		return false
	}
}

export default {
	storeData
}
