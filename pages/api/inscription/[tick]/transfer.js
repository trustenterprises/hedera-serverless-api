import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import TransferInscriptionHandler from "app/handler/inscriptions/transferHandler"

export default prepare(
	onlyPost,
	withAuthentication,
	useHashgraphContext
)(TransferInscriptionHandler)
