import Validation from "app/validators"
import Status from "app/constants/status"

const MESSAGES = {
	noApikey: 'Please set "x-api-key" in your header',
	invalidApikey: 'Unable to validate with the supplied "x-api-key"'
}

function withAuthentication(handler) {
	return async (req, res) => {
		const apiKey = req.headers["x-api-key"]

		if (apiKey === undefined || !apiKey.length) {
			return res.status(Status.UNAUTHORIZED).send(MESSAGES.noApikey)
		}

		if (!Validation.checkAuthenticationKey(apiKey)) {
			return res.status(Status.UNAUTHORIZED).send(MESSAGES.invalidApikey)
		}

		return handler(req, res)
	}
}

export default withAuthentication
