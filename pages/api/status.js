import withAuthentication from "app/middleware/withAuthentication"
import Config from "app/config"
import Language from "app/constants/language"

const { statusRequest } = Language

async function ConnectionStatusHandler(req, res) {
	res.statusCode = 200

	if (!!Config.hideStatus) {
		return res.send("ok")
	}

	return res.json({
		message: statusRequest.message,
		environment_status: {
			hederaAccountId: !!Config.accountId,
			hederaPrivateKey: !!Config.privateKey,
			authenticationKey:
				!!Config.authenticationKey && Config.authenticationKeyValid()
		},
		meta: {
			hint: statusRequest.meta_hint
		}
	})
}

export default ConnectionStatusHandler
