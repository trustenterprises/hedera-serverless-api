import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import MintNftHandler from "app/handler/mintNftHandler"

export default prepare(
	onlyPost,
	withAuthentication,
	useHashgraphContext
)(MintNftHandler)
