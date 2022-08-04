import Language from "app/constants/language"
import Response from "app/response"
import Config from "app/config"

const { noKey } = Language.middleware.ensureNftStorageToken

function ensureNftStorageAvailable(handler) {
	return async (req, res) => {
		if (Config.nftStorageToken?.length) {
			return handler(req, res)
		}

		return Response.unprocessibleEntity(res, noKey)
	}
}

export default ensureNftStorageAvailable
