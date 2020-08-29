import Response from "app/response"

async function ExampleWebhookHandler(req, res) {
	console.log(
		"Example webhook handler for sending consensus responses to your app."
	)
	Response.json(res, req.body)
}

export default ExampleWebhookHandler
