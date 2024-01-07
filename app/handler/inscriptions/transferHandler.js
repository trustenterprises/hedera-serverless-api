import transferInscriptionRequest from "app/validators/inscriptions/transferRequest"
import Response from "app/response"
import Config from "app/config"

async function TransferInscriptionHandler(req, res) {
	const validationErrors = transferInscriptionRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const {
		amount,
		from,
		to,
		memo,
		topic_id = Config.inscriptionTopic
	} = req.body

	const { tick } = req.query

	const transfer = {
		p: "hcs-20", // default
		op: "transfer", // default
		tick,
		amt: amount,
		from,
		to,
		m: memo
	}

	const messageOptions = {
		message: JSON.stringify(transfer),
		topic_id
	}

	const { hashgraphClient } = req.context

	const response = await hashgraphClient.sendConsensusMessage(
		messageOptions
	)

	Response.json(res, {
		...response,
		inscription: transfer
	})
}

export default TransferInscriptionHandler
