import Response from "app/response"
import sendTokenRequest from "app/validators/sendTokenRequest"

async function SendTokenHandler(req, res) {
	const validationErrors = sendTokenRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { receiver_id, token_id, amount, decimals } = req.body

	const sendPayload = {
		receiver_id,
		token_id,
		amount,
		decimals
	}

	const { hashgraphClient } = req.context
	const sendResponse = await hashgraphClient.sendTokens(sendPayload)

	if (sendResponse) {
		return Response.json(res, sendResponse)
	}

	return Response.badRequest(res)
}

export default SendTokenHandler
