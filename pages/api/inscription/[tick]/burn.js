import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import BurnInscriptionHandler from "app/handler/inscriptions/burnHandler"

export default prepare(
	onlyPost,
	withAuthentication,
	useHashgraphContext
)(BurnInscriptionHandler)
