import Language from "app/constants/language"
import Validation from "app/validators"
import Response from "app/response"

const {
	noApikey,
	invalidApikey
} = Language.middleware.withAuthenticationResponse

function withAuthentication(handler) {
	return async (req, res) => {
		const apiKey = req.headers && req.headers["x-api-key"]

		if (apiKey === undefined || !apiKey.length) {
			return Response.unauthorised(res, noApikey)
		}

		if (!Validation.checkAuthenticationKey(apiKey)) {
			return Response.unauthorised(res, invalidApikey)
		}

		return handler(req, res)
	}
}

export default withAuthentication
