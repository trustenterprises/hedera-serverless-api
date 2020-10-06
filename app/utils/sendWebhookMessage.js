import Config from "app/config"
import Hmac from "app/utils/hmac"
import axios from "axios"

function sendWebhookMessage(data) {
	const { webhookUrl } = Config

	if (!webhookUrl || !data) {
		console.warn("Unable to send webhook, no url or payload")
		return
	}

	const dataAsString = JSON.stringify(data)
	const config = {
		headers: {
			"x-signature": Hmac.generateHash(dataAsString)
		}
	}

	try {
		axios.post(webhookUrl, data, config)
	} catch (e) {
		console.error(e)
	}
}

export default sendWebhookMessage
