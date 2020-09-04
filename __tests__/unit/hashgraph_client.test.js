import HashgraphClient from "app/hashgraph/client"
import Config from "app/config"

test("The HashgraphClient should not throw on creation", () => {
	expect(() => {
		new HashgraphClient()
	}).not.toThrow();
})

test("The HashgraphClient should throw if network is in correct", () => {
	expect(() => {
		Config.network = 'badnetwork'
		new HashgraphClient()
	}).toThrow("Network from environment badnetwork could not match for any hedera network. Change your \"HEDERA_NETWORK\" environment variable to either: \"testnet\", \"previewnet\" or \"mainnet\"");
})
