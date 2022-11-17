import Response from "app/response"
import transferNftRequest from "app/validators/transferNftRequest"
import batchTransferNftRequest from "../validators/batchTransferNftRequest"

async function BatchTransferNftHandler(req, res) {
	const validationErrors = batchTransferNftRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { receiver_id, token_id, amount } = req.body

	const batchTransferPayload = {
		receiver_id,
		token_id,
		amount
	}

	const { hashgraphClient } = req.context
	const sendResponse = await hashgraphClient.batchTransferNft(
		batchTransferPayload
	)

	if (sendResponse.error) {
		return Response.unprocessibleEntity(res, sendResponse.error)
	}

	if (sendResponse) {
		return Response.json(res, sendResponse)
	}

	return Response.badRequest(res)
}

export default BatchTransferNftHandler
