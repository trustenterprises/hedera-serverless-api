import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import MintInscriptionHandler from "app/handler/inscriptions/mintHandler"

export default prepare(
	onlyPost,
	withAuthentication,
	useHashgraphContext
)(MintInscriptionHandler)
