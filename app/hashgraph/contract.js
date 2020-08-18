class HashgraphClientContract {
	constructor() {
		if (!this.createNewTopic) {
			throw new Error(
				'The hashgraph client must implement a "createNewTopic" method'
			)
		}

		if (!this.accountBalanceQuery) {
			throw new Error(
				'The hashgraph client must implement a "accountBalanceQuery" method'
			)
		}
	}
}

export default HashgraphClientContract
