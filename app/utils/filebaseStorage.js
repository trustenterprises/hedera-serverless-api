import { FilebaseClient } from "@filebase/client"
import Config from "app/config"

// Returns metadata for pinned payload
async function storeData(payload) {
	const storage = new FilebaseClient({ token: Config.nftStorageToken })

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
