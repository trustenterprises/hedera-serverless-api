import Response from "app/response"

async function GetAccountBalanceHandler(req, res) {
	const { hashgraphClient } = req.context
	const balance = await hashgraphClient.accountBalanceQuery()

	Response.json(res, balance)
}

export default GetAccountBalanceHandler
