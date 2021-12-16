import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import ensureEncryptionKey from "app/middleware/ensureEncryptionKey"
import SendTokenHandler from "app/handler/sendTokenHandler"

export default prepare(
	onlyPost,
	ensureEncryptionKey,
	withAuthentication,
	useHashgraphContext
)(SendTokenHandler)
