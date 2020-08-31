import Response from "app/response"
import Hmac from "app/utils/hmac"

async function ExampleWebhookHandler(req, res) {
	console.log(
		"Example webhook handler for sending consensus responses to your app."
	)

	const signature = req.headers["x-signature"]

	if (!signature) {
		return Response.badRequest(res)
	}

	const stringifyData = JSON.stringify(req.body)
	const isSignatureValid = Hmac.validateSignature(stringifyData, signature)

	if (!isSignatureValid) {
		return Response.badRequest(res)
	}

	Response.json(res, req.body.data)
}

export default ExampleWebhookHandler
