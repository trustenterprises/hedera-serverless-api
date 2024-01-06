import deployInscriptionRequest from "app/validators/inscriptions/deployRequest"
import Response from "app/response"
import Config from "app/config"

async function DeployInscriptionHandler(req, res) {
	const validationErrors = deployInscriptionRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const {
		name,
		ticker,
		max,
		limit,
		metadata,
		memo,
		topic_id = Config.inscriptionTopic
	} = req.body

	const deploy = {
		p: "hcs-20", // default
		op: "deploy", // default
		name,
		tick: ticker,
		max,
		lim: limit,
		metadata,
		m: memo
	}

	const messageOptions = {
		message: JSON.stringify(deploy),
		topic_id
	}

	const { hashgraphClient } = req.context

	const response = await hashgraphClient.sendConsensusMessage(
		messageOptions
	)

	Response.json(res, {
		response,
		payload: deploy
	})
}

export default DeployInscriptionHandler
