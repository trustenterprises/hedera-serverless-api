import Config from "app/config"
import axios from "axios"

function sendWebhookMessage(data) {
	const { webhookUrl } = Config

	if (!webhookUrl || !data) {
		console.warn("Unable to send webhook, no url or payload")
		return
	}

	try {
		axios.post(webhookUrl, { data })
	} catch (e) {
		console.error(e)
	}
}

export default sendWebhookMessage
