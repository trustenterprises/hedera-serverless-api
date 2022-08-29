import mintNftRequest from "app/validators/mintNftRequest"
import Response from "app/response"

async function MintNftHandler(req, res) {
	const validationErrors = mintNftRequest(req.body)

	if (validationErrors) {
		return Response.unprocessibleEntity(res, validationErrors)
	}

	const { token_id } = req.query
	const { amount, cid } = req.body

	const { hashgraphClient } = req.context

	const token = await hashgraphClient.mintNonFungibleToken({
		token_id,
		amount,
		cid
	})

	if (token.errors) {
		return Response.unprocessibleEntity(res, token.errors)
	}

	Response.json(res, token)
}

export default MintNftHandler
