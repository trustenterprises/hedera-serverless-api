import withAuthentication from "app/middleware/withAuthentication"
import Config from "app/config"

async function ConnectionStatusHandler(req, res) {
	res.statusCode = 200

	if (!!Config.hideStatus) {
		return res.send("ok")
	}

	return res.json({
		message: "Your environment status for your client",
		environment_set: {
			hederaAccountId: !!Config.accountId,
			hederaPrivateKey: !!Config.privateKey,
			authenticationKey: !!Config.authenticationKey
		},
		meta: {
			message:
				'Hide this status endpoint by setting "HIDE_STATUS=TRUE" in your environment'
		}
	})
}

export default ConnectionStatusHandler
