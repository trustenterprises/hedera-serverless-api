import Config from "app/config"
import Hmac from "app/utils/hmac"
import axios from "axios"

async function sendWebhookMessage(data) {
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
		await axios.post(webhookUrl, data, config)
	} catch (e) {
		throw new Error("Unable to send payload to webhook " + webhookUrl)
	}
}

export default sendWebhookMessage
