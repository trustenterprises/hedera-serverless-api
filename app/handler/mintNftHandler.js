import Response from "app/response"

async function MintNftHandler(req, res) {
	// Change to NFT specific
	// const validationErrors = createNftRequest(req.body)
	//
	// if (validationErrors) {
	// 	return Response.unprocessibleEntity(res, validationErrors)
	// }

	const { token_id, amount } = req.query

	// TODO:
	// const {
	// 	symbol,
	// 	name,
	// 	supply,
	// 	memo,
	// 	requires_kyc = false,
	// 	can_freeze = false
	// } = req.body
	//
	const { hashgraphClient } = req.context

	// TODO:
	const token = await hashgraphClient.mintNonFungibleToken({
		token_id,
		amount
		// memo,
		// name,
		// symbol,
		// supply,
		// requires_kyc,
		// can_freeze
	})

	Response.json(res, token)
}

export default MintNftHandler
