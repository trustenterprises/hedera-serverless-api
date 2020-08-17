class HashgraphClientContract {
	constructor() {
		if (!this.createNewTopic) {
			throw new Error('A job must implement a "createNewTopic" method')
		}

		if (!this.accountBalanceQuery) {
			throw new Error('A job must implement a "accountBalanceQuery" method')
		}
	}
}

export default HashgraphClientContract
