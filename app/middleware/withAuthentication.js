import Language from "app/constants/language"
import Validation from "app/validators"
import Status from "app/constants/status"

const {
	noApikey,
	invalidApikey
} = Language.middleware.withAuthenticationResponse

function withAuthentication(handler) {
	return async (req, res) => {
		const apiKey = req.headers && req.headers["x-api-key"]

		if (apiKey === undefined || !apiKey.length) {
			return res.status(Status.UNAUTHORIZED).send(noApikey)
		}

		if (!Validation.checkAuthenticationKey(apiKey)) {
			return res.status(Status.UNAUTHORIZED).send(invalidApikey)
		}

		return handler(req, res)
	}
}

export default withAuthentication
