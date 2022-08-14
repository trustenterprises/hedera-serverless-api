import Language from "app/constants/language"
import Response from "app/response"
import Config from "app/config"

const { notSet } = Language.middleware.mirrornode

function ensureMirrornodeSet(handler) {
	return async (req, res) => {
		if (Config.mirrornodeUrl?.length) {
			return handler(req, res)
		}

		return Response.unprocessibleEntity(res, notSet)
	}
}

export default ensureMirrornodeSet
