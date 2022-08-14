import createNftRequest from "app/validators/createNftRequest"
import Response from "app/response"

async function CreateNftHandler(req, res) {
	const validationErrors = createNftRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const {
		collection_name,
		symbol,
		supply,
		allow_custom_fees,
		royalty_fee,
		fallback_fee,
		enable_unsafe_keys = false
	} = req.body

	const { hashgraphClient } = req.context

	const token = await hashgraphClient.createNonFungibleToken({
		collection_name,
		symbol,
		supply,
		allow_custom_fees,
		royalty_fee,
		fallback_fee,
		enable_unsafe_keys
	})

	Response.json(res, token)
}

export default CreateNftHandler
