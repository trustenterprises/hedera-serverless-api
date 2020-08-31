import Config from "app/config"
import Crypto from "crypto"

/*
 * The webhook mechanism requires a HMAC hash to ensure the source of any
 * consensus message, to quickly check for validity.
 *
 * This HMAC hash is sent in the 'x-signature' property in the header, when
 * sent to the webhook URL.
 *
 * Unless the `x-api-key` has been compromised only the serverless client
 * and the server will be able to duplicate the signature.
 */

function generateHash(payloadAsString) {
	if (typeof payloadAsString !== "string") {
		throw "Your payload object must be converted in to a string"
	}

	return Crypto.createHmac("sha256", Config.authenticationKey)
		.update(payloadAsString)
		.digest("hex")
}

function validateSignature(payloadAsString, signature) {
	const hash = generateHash(payloadAsString)

	return hash === signature
}

export default {
	generateHash,
	validateSignature
}
