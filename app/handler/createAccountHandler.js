import Response from "app/response"

async function CreateAccountHandler(req, res) {
	const { hashgraphClient } = req.context
	const account = await hashgraphClient.createAccount()

	Response.json(res, account)
}

export default CreateAccountHandler
