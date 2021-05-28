import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import CreateTokenHandler from "app/handler/createTokenHandler"

export default prepare(
	onlyPost,
	withAuthentication,
	useHashgraphContext
)(CreateTokenHandler)
