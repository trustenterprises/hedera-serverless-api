import onlyGet from "app/middleware/onlyGet"
import withAuthentication from "app/middleware/withAuthentication"
import useHashgraphContext from "app/context/useHashgraphContext"
import prepare from "app/utils/prepare"
import GetAccountBalanceHandler from "app/handler/getAccountBalanceHandler"

export default prepare(
	onlyGet,
	withAuthentication,
	useHashgraphContext
)(GetAccountBalanceHandler)
