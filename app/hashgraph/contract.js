function throwUnless(candidate, method) {
	if (!candidate) {
		throw new Error(`The hashgraph client must implement a "${method}" method`)
	}
}

class HashgraphClientContract {
	constructor() {
		throwUnless(this.createNewTopic, "createNewTopic")
		throwUnless(this.getTopicInfo, "getTopicInfo")
		throwUnless(this.accountBalanceQuery, "accountBalanceQuery")
	}
}

export default HashgraphClientContract
