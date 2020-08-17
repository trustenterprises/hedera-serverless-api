import HashgraphClient from "./hashgraphClient"

function useMockedHashgraphContext(handler) {
	return async (req, res) => {

		const hashgraphClient = new HashgraphClient()

		req.context = {
			hashgraphClient
		}

		return handler(req, res)
	}
}

export default useMockedHashgraphContext
