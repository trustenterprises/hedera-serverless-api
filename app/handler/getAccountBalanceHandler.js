// The raw request handler before middleware, validators and injected context
async function GetAccountBalanceHandler(req, res) {
	const { hashgraphClient } = req.context
	const response = await hashgraphClient.accountBalanceQuery()

	res.statusCode = 200
	res.json({ data: response })
}

export default GetAccountBalanceHandler
