import Environment from "app/constants/environment"
import Config from "app/config"

const ExplorerUrl = {
	[Environment.TESTNET]: "https://ledger-testnet.hashlog.io/tx/",
	[Environment.PREVIEWNET]: null,
	[Environment.MAINNET]: "https://ledger.hashlog.io/tx/"
}

function getExplorerUrl(tx) {
	const network = Config.HEDERA_NETWORK || Environment.TESTNET

	if (network) {
		return ExplorerUrl[network] + tx
	}
}

export default {
	getExplorerUrl
}
