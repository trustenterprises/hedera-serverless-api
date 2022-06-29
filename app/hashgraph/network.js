import Config from "app/config"
import Environment from "app/constants/environment"
import { AccountId, Client } from "@hashgraph/sdk"

const { TESTNET, PREVIEWNET, MAINNET } = Environment

/**
 * Provide a list of nodes that are working in the hedera network,
 * there could be some nodes that fail to work, shall we develop
 * a mechanism for dynamically defaulting to these nodes on failure?
 *
 * Lots of questions.
 */

// Current testnet nodes from Greg, via discord
const nodes = {
	"0.testnet.hedera.com:50211": new AccountId(3)
	//"1.testnet.hedera.com:50211": new AccountId(4),
	//"2.testnet.hedera.com:50211": new AccountId(5),
	//"3.testnet.hedera.com:50211": new AccountId(6),
	//"4.testnet.hedera.com:50211": new AccountId(7),
	//"5.testnet.hedera.com:50211": new AccountId(8),
	//"6.testnet.hedera.com:50211": new AccountId(9)
}

const testnetNodes = Client.forTestnet()
//const testnetNodes = Client.forNetwork(nodes)
//
// Current testnet nodes from Greg, via discord
const nodesForMain = {
	// "35.186.191.247:50211": new AccountId(4),
	"35.204.86.32:50211": new AccountId(12)
}

const mainnetNodes = Client.forMainnet()
// const mainnetNodes = Client.forNetwork(nodesForMain)

const previewnetNodes = Client.forPreviewnet()

const networkForEnvironment = {
	[TESTNET]: {
		name: TESTNET,
		nodes: testnetNodes
	},
	[PREVIEWNET]: {
		name: PREVIEWNET,
		nodes: previewnetNodes
	},
	[MAINNET]: {
		name: MAINNET,
		nodes: mainnetNodes
	}
}

// Remove memory leak of creating a new network client
let hederaNetworkClient = null

const getNodeNetworkClient = () => {
	const network = networkForEnvironment[Config.network]

	if (!network || !network.nodes) {
		throw `Network from environment ${Config.network} could not match for any hedera network. Change your "HEDERA_NETWORK" environment variable to either: "testnet", "previewnet" or "mainnet"`
	}

	if (hederaNetworkClient === null) {
		hederaNetworkClient = new Client({
			network: network.nodes.network
		}).setOperator(Config.accountId, Config.privateKey)
	}

	return hederaNetworkClient
}

export default {
	networkForEnvironment,
	getNodeNetworkClient
}
