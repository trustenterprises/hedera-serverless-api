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

// Currently remove 0.0.3 as it is causing issues
const testnetNodes = {
	// "0.testnet.hedera.com:50211": "0.0.3",
	"1.testnet.hedera.com:50211": "0.0.4",
	"2.testnet.hedera.com:50211": "0.0.5",
	"3.testnet.hedera.com:50211": "0.0.6"
}

// This is a direct duplication from hedera-sdk-js
const mainnetNodes = {
	"35.237.200.180:50211": "0.0.3",
	"35.186.191.247:50211": "0.0.4",
	"35.192.2.25:50211": "0.0.5",
	"35.199.161.108:50211": "0.0.6",
	"35.203.82.240:50211": "0.0.7",
	"35.236.5.219:50211": "0.0.8",
	"35.197.192.225:50211": "0.0.9",
	"35.242.233.154:50211": "0.0.10",
	"35.240.118.96:50211": "0.0.11",
	"35.204.86.32:50211": "0.0.12"
}

// This is a direct duplication from hedera-sdk-js
const previewnetNodes = {
	"0.previewnet.hedera.com:50211": "0.0.3",
	"1.previewnet.hedera.com:50211": "0.0.4",
	"2.previewnet.hedera.com:50211": "0.0.5",
	"3.previewnet.hedera.com:50211": "0.0.6"
}

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

	return new Client({ network: network.nodes }).setOperator(
		Config.accountId,
		Config.privateKey
	)
}

export default {
	networkForEnvironment,
	getNodeNetworkClient
}
