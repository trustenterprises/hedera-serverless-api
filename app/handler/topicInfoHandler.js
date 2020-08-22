import Response from "app/response"

async function TopicInfoHandler(req, res) {
	const { id } = req.query
	const { hashgraphClient } = req.context

	const topic = await hashgraphClient.getTopicInfo(id)

	// const info = await hashgraphClient.accountBalanceQuery()
	// Response.json(res, info)

	Response.json(res, topic)
}

export default TopicInfoHandler
