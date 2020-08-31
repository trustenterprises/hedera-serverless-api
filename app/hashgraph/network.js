import Config from "app/config"
import { Client } from "@hashgraph/sdk"

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

// Testing and development for development only.
// Need to add option for changing to previewnet/testnet/mainnet
const getNodeNetworkClient = () => {
	return new Client({ network: testnetNodes }).setOperator(
		// return new Client({ network: previewnetNodes }).setOperator(
		Config.accountId,
		Config.privateKey
	)
}

export default {
	testnetNodes,
	mainnetNodes,
	previewnetNodes,
	getNodeNetworkClient
}
