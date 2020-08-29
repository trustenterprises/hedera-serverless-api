import createTopicRequest from "app/validators/createTopicRequest"
import Response from "app/response"

async function CreateTopicHandler(req, res) {
	const validationErrors = createTopicRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { memo, enable_private_submit_key } = req.body
	const topicOptions = { memo, enable_private_submit_key }

	const { hashgraphClient } = req.context
	const newTopicResponse = await hashgraphClient.createNewTopic(topicOptions)

	Response.json(res, newTopicResponse)
}

export default CreateTopicHandler
