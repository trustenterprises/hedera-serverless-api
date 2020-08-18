import Status from "app/constants/status"
import createTopicRequest from "app/validators/createTopicRequest"

// The raw request handler before middleware, validators and injected context
// All handlers are going to tightly couple the validation

async function CreateTopicHandler(req, res) {
	const validationErrors = createTopicRequest(req.body)

	if (validationErrors) {
		return res
			.status(Status.UNPROCESSIBLE_ENTITY)
			.send({ errors: validationErrors })
	}

	const { memo, enable_private_submit_key } = req.body
	const topicOptions = { memo, enable_private_submit_key }

	const { hashgraphClient } = req.context
	const newTopicResponse = await hashgraphClient.createNewTopic(topicOptions)

	res.statusCode = 200
	res.json({ data: newTopicResponse })
}

export default CreateTopicHandler
