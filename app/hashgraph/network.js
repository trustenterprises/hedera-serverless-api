import Config from "app/config"
import Environment from "app/constants/environment"
import { Client } from "@hashgraph/sdk"

const { TESTNET, PREVIEWNET, MAINNET } = Environment

/**
 * Provide a list of nodes that are working in the hedera network,
 * there could be some nodes that fail to work, shall we develop
 * a mechanism for dynamically defaulting to these nodes on failure?
 *
 * Lots of questions.
 */

const testnetNodes = Client.forTestnet()

const mainnetNodes = Client.forMainnet()

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

const getNodeNetworkClient = () => {
	const network = networkForEnvironment[Config.network]

	if (!network || !network.nodes) {
		throw `Network from environment ${Config.network} could not match for any hedera network. Change your "HEDERA_NETWORK" environment variable to either: "testnet", "previewnet" or "mainnet"`
	}

	return new Client({ network: network.nodes.network }).setOperator(
		Config.accountId,
		Config.privateKey
	)
}

export default {
	networkForEnvironment,
	getNodeNetworkClient
}
