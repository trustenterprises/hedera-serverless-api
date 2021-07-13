import Language from "app/constants/language"
import Response from "app/response"
import Config from "app/config"

const { noEncryptionKey } = Language.middleware.ensureEncryptionKey

const ENC_KEY_LEN = 32

function ensureEncryptionKey(handler) {
	return async (req, res) => {
		if (Config.encryptionKey?.length === ENC_KEY_LEN) {
			return handler(req, res)
		}

		return Response.unprocessibleEntity(res, noEncryptionKey)
	}
}

export default ensureEncryptionKey
