import Response from "app/response"
import claimNftRequest from "app/validators/claimNftRequest"

async function ClaimNftHandler(req, res) {
	const validationErrors = claimNftRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { receiver_id, token_id, nft_pass_token_id, serial_number } = req.body

	const claimPayload = {
		token_id,
		receiver_id,
		nft_pass_token_id,
		serial_number
	}

	const { hashgraphClient } = req.context
	const sendResponse = await hashgraphClient.claimNft(claimPayload)

	if (sendResponse.error) {
		return Response.unprocessibleEntity(res, sendResponse.error)
	}

	if (sendResponse) {
		return Response.json(res, sendResponse)
	}

	return Response.badRequest(res)
}

export default ClaimNftHandler
