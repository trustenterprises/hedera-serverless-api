import Response from "app/response"

async function UpdateTopicHandler(req, res) {
	const { hashgraphClient } = req.context
	// const info = await hashgraphClient.accountBalanceQuery()

	// Response.json(res, info)
	Response.json(res, "UpdateTopicHandler")
}

export default UpdateTopicHandler
