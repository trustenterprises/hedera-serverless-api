import createMetadataRequest from "app/validators/createMetadataRequest"
import Response from "app/response"
import NftStorage from "app/utils/nftStorage"
import Language from "app/constants/language"

async function CreateMetadataHandler(req, res) {
	const validationErrors = createMetadataRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(
			res,
			validationErrors,
			Language.ensureNftStorageAvailable.meta
		)
	}

	const cid = await NftStorage.storeData(req.body)

	if (cid) {
		return Response.json(res, { cid })
	}

	// 🚨 Catch any other errors, like if a token is invalid.
	return Response.badRequest(res)
}

export default CreateMetadataHandler
