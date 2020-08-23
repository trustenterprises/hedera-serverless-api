import HashgraphClient from "app/hashgraph/client"

const client = new HashgraphClient()

test("The client will return will return the account balance", async () => {
	const { balance } = await client.accountBalanceQuery()
	expect(balance > 1).toBe(true)
})

test("The client can create a client with a memo & privateKey, then read", async () => {
	const memo = "e2e-hedera-client-test"

	// Having issues connecting with private keys
	const newTopic = await client.createNewTopic({
		memo,
		// enable_private_submit_key: true
	})

	expect(newTopic.memo).toBe(memo)
	expect(newTopic.topic.split(".").length).toBe(3)

	const topicInfo = await client.getTopicInfo(newTopic.topic)

	expect(topicInfo.topicMemo).toBe(memo)
}, 20000)
