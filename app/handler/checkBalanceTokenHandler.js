import Response from "app/response"

async function CheckBalanceTokenHandler(req, res) {
	const { id, token_id, decimals } = req.query

	const balancePayload = {
		account_id: id,
		token_id,
		decimals
	}

	const { hashgraphClient } = req.context
	const balanceResponse = await hashgraphClient.getTokenBalance(balancePayload)

	if (balanceResponse) {
		return Response.json(res, balanceResponse)
	}

	return Response.badRequest(res)
}

export default CheckBalanceTokenHandler
