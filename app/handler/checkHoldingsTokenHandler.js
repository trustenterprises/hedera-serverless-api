import Response from "app/response"

async function CheckHoldingsTokenHandler(req, res) {
	const { id, token_ids } = req.query

	const holdingsPayload = {
		account_id: id,
		token_ids: token_ids.split(",")
	}

	const { hashgraphClient } = req.context
	const balanceResponse = await hashgraphClient.hasTokenHoldings(
		holdingsPayload
	)

	if (balanceResponse) {
		return Response.json(res, balanceResponse)
	}

	return Response.badRequest(res)
}

export default CheckHoldingsTokenHandler
