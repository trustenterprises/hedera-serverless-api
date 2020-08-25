import Response from "app/response"

async function TopicInfoHandler(req, res) {
	const { id } = req.query
	const { hashgraphClient } = req.context

	const topic = await hashgraphClient.getTopicInfo(id)

	Response.json(res, topic)
}

export default TopicInfoHandler
