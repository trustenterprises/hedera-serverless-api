// The raw request handler before middleware, validators and injected context
async function CreateTopicHandler(req, res) {
	const { hashgraphClient } = req.context
	const newTopicResponse = await hashgraphClient.createNewTopic()

	res.statusCode = 200
	res.json({ data: newTopicResponse })
}

export default CreateTopicHandler
