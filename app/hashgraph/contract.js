function throwUnless(candidate, method) {
	if (!candidate) {
		throw new Error(`The hashgraph client must implement a "${method}" method`)
	}
}

/*
 * Typescript candidate, if the additional complexity is worth it.
 */
class HashgraphClientContract {
	constructor() {
		// Handle topic CRUD and other things.
		throwUnless(this.createNewTopic, "createNewTopic")
		throwUnless(this.getTopicInfo, "getTopicInfo")
		throwUnless(this.updateTopic, "updateTopic")
		// throwUnless(this.deleteTopic, "deleteTopic")

		// Basic functions for user info.
		throwUnless(this.accountBalanceQuery, "accountBalanceQuery")

		// Sending a message for capturing consensus timestamps
		throwUnless(this.sendConsensusMessage, "sendConsensusMessage")
	}
}

export default HashgraphClientContract
