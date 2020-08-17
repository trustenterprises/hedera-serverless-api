import Language from "app/constants/language"
import Status from "app/constants/status"

const { notAllowed } = Language.middleware.onlyPostResponse

function onlyGet(handler) {
	return async (req, res) => {
		if (req.method !== "GET") {
			return res.status(Status.METHOD_NOT_ALLOWED).send(notAllowed(req.method))
		}

		return handler(req, res)
	}
}

export default onlyGet
