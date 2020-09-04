import Environment from "app/constants/environment"
import Config from "app/config"
import HashgraphNodeNetwork from "app/hashgraph/network"

test("Make sure that testnet has the correct value", () => {
	expect(Environment.TESTNET).toBe('testnet')
})

test("Make sure that previewnet has the correct value", () => {
	expect(Environment.PREVIEWNET).toBe('previewnet')
})

test("Make sure that mainnet has the correct value", () => {
	expect(Environment.MAINNET).toBe('mainnet')
})

test("Make sure that config network points to one of the values", () => {
	const network = HashgraphNodeNetwork.networkForEnvironment
	const { name } = network[Config.network]

	expect(
		name === Environment.TESTNET ||
		name === Environment.PREVIEWNET ||
		name === Environment.MAINNET
	).toBe(true)
})
