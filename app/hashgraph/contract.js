class HashgraphClientContract {
	constructor() {
		if (!this.createNewTopic) {
			throw new Error('A job must implement a "createNewTopic" method')
		}
	}
}

export default HashgraphClientContract
