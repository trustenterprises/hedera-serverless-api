import createMetadataRequest from "app/validators/createMetadataRequest"
import Response from "app/response"
import NftStorage from "app/utils/nftStorage"

async function CreateMetadataHandler(req, res) {

	const validationErrors = createMetadataRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	// TODO: Separate NFT storage from mint (demo image)

	console.log(req.body)

	const metadata = req.body

	return 	Response.json(res, { metadata } )

	const cid = await NftStorage.storeData(metadata)

	Response.json(res, { cid } )
}

export default CreateMetadataHandler
