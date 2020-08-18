import HashgraphClientContract from "app/hashgraph/contract"

test("Check hashgraph contract throws errors, 'createNewTopic' not set", () => {
	expect(() => {
		new HashgraphClientContract()
	}).toThrow('The hashgraph client must implement a "createNewTopic" method');
})

test("Check hashgraph contract throws errors, 'accountBalanceQuery' not set", () => {

	class HashgraphClientNoBalance extends HashgraphClientContract {
		createNewTopic () {
			return true
		}
	}

	expect(() => {
		new HashgraphClientNoBalance()
	}).toThrow('The hashgraph client must implement a "accountBalanceQuery" method');
})
