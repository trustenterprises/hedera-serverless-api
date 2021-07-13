import bequestTokenRequest from "app/validators/bequestTokenRequest"
import Response from "app/response"

async function BequestTokenHandler(req, res) {
	const validationErrors = bequestTokenRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { encrypted_receiver_key, token_id, receiver_id, amount } = req.body
	const bequestPayload = {
		encrypted_receiver_key,
		token_id,
		receiver_id,
		amount
	}

	const { hashgraphClient } = req.context
	const bequestResponse = await hashgraphClient.bequestToken(bequestPayload)

	if (bequestResponse) {
		return Response.json(res, bequestResponse)
	}

	// This has to be bolstered up with correct error handling
	return Response.badRequest(res)
}

export default BequestTokenHandler
