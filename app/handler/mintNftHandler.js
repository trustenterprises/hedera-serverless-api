import mintNftRequest from "app/validators/mintNftRequest"
import Response from "app/response"

async function MintNftHandler(req, res) {

	const validationErrors = mintNftRequest(req.query)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { token_id, amount, cid } = req.query

	const { hashgraphClient } = req.context

	const token = await hashgraphClient.mintNonFungibleToken({
		token_id,
		amount,
		cid
	})

	Response.json(res, token)
}

export default MintNftHandler
