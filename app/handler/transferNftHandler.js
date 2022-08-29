import Response from "app/response"
import transferNftRequest from "app/validators/transferNftRequest"

async function TransferNftHandler(req, res) {
	const validationErrors = transferNftRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { receiver_id, token_id, serial_number } = req.body

	const transferPayload = {
		receiver_id,
		token_id,
		serial_number
	}

	const { hashgraphClient } = req.context
	const sendResponse = await hashgraphClient.transferNft(transferPayload)

	if (sendResponse.error) {
		return Response.unprocessibleEntity(res, sendResponse.error)
	}

	if (sendResponse) {
		return Response.json(res, sendResponse)
	}

	return Response.badRequest(res)
}

export default TransferNftHandler
