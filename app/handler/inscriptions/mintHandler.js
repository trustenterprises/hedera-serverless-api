import mintInscriptionRequest from "app/validators/inscriptions/mintRequest"
import Response from "app/response"
import Config from "app/config"

async function MintInscriptionHandler(req, res) {
	const validationErrors = mintInscriptionRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const {
		amount,
		to,
		memo,
		topic_id = Config.inscriptionTopic
	} = req.body

	const { tick } = req.query


	const mint = {
		p: "hcs-20", // default
		op: "mint", // default
		tick,
		amt: amount,
		to,
		m: memo
	}

	const messageOptions = {
		message: JSON.stringify(mint),
		topic_id
	}

	const { hashgraphClient } = req.context

	const response = await hashgraphClient.sendConsensusMessage(
		messageOptions
	)

	Response.json(res, {
		...response,
		inscription: mint
	})
}

export default MintInscriptionHandler
