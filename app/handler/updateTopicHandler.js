import createTopicRequest from "app/validators/createTopicRequest"
import Response from "app/response"

async function UpdateTopicHandler(req, res) {
	const validationErrors = createTopicRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { id } = req.query
	const { memo } = req.body
	const topicOptions = {
		memo,
		topic_id: id
	}

	const { hashgraphClient } = req.context
	const updateTopicResponse = await hashgraphClient.updateTopic(topicOptions)

	Response.json(res, {
		...topicOptions,
		...updateTopicResponse
	})
}

export default UpdateTopicHandler
