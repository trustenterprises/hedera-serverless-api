import Response from "app/response"

async function DeleteTopicHandler(req, res) {
	const { hashgraphClient } = req.context
	// const info = await hashgraphClient.accountBalanceQuery()

	// Response.json(res, info)
	Response.json(res, "DeleteTopicHandler")
}

export default DeleteTopicHandler
