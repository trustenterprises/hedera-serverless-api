import consensusMessageRequest from "app/validators/consensusMessageRequest"
import Response from "app/response"

async function CreateConsensusMessageHandler(req, res) {
	const validationErrors = consensusMessageRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { message, allow_synchronous_consensus, topic_id, reference } = req.body
	const messageOptions = {
		message,
		reference,
		allow_synchronous_consensus,
		topic_id
	}

	const { hashgraphClient } = req.context
	const consensusMessageResponse = await hashgraphClient.sendConsensusMessage(
		messageOptions
	)

	Response.json(res, consensusMessageResponse)
}

export default CreateConsensusMessageHandler
