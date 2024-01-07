import burnInscriptionRequest from "app/validators/inscriptions/burnRequest"
import Response from "app/response"
import Config from "app/config"

async function BurnInscriptionHandler(req, res) {
	const validationErrors = burnInscriptionRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const {
		amount,
		from,
		memo,
		topic_id = Config.inscriptionTopic
	} = req.body

	const { tick } = req.query

	const burn = {
		p: "hcs-20", // default
		op: "burn", // default
		tick,
		amt: amount,
		from,
		m: memo
	}

	const messageOptions = {
		message: JSON.stringify(burn),
		topic_id
	}

	const { hashgraphClient } = req.context

	const response = await hashgraphClient.sendConsensusMessage(
		messageOptions
	)

	Response.json(res, {
		...response,
		inscription: burn
	})
}

export default BurnInscriptionHandler
