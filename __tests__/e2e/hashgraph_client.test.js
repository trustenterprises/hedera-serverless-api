import HashgraphClient from "app/hashgraph/client"
import sleep from "app/utils/sleep"

const client = new HashgraphClient()

test("The client will return will return the account balance", async () => {
	const { balance } = await client.accountBalanceQuery()
	expect(balance > 1).toBe(true)
})

test("The client can create a topic with a memo, then read", async () => {
	const memo = "e2e-hedera-client-test"

	const newTopic = await client.createNewTopic({
		memo,
		// enable_private_submit_key: true
	})

	expect(newTopic.memo).toBe(memo)
	expect(newTopic.topic.toString().split(".").length).toBe(3)

	const topicInfo = await client.getTopicInfo(newTopic.topic)

	expect(topicInfo.topicMemo).toBe(memo)
}, 20000)

test("The client can create a topic, send a message and get the tx", async () => {
	const memo = "e2e-hedera-client-test"
	const newTopic = await client.createNewTopic({ memo })
	const topicInfo = await client.getTopicInfo(newTopic.topic)

	const consensusMessage = await client.sendConsensusMessage({
		topic_id: newTopic.topic,
		message: "This is a test message"
	})

	expect(consensusMessage.transaction_id).not.toBe(null)

}, 20000)

test("The client can create a private topic, send a message and get the tx", async () => {
	const memo = "e2e-hedera-client-test"
	const newTopic = await client.createNewTopic({
		memo,
		enable_private_submit_key: true
	})

	const consensusMessage = await client.sendConsensusMessage({
		topic_id: newTopic.topic,
		message: "This is a test message",
		receipt: newTopic.receipt
	})

	expect(consensusMessage.transaction_id).not.toBe(null)
}, 20000)

test("The client can update the memo of a private topic", async () => {
	const memo = "e2e-hedera-client-test"
	const newTopic = await client.createNewTopic({
		memo,
		enable_private_submit_key: true
	})

	const topicInfo = await client.getTopicInfo(newTopic.topic)
	expect(topicInfo.topicMemo).toBe(memo)

	const newMemo = "This is the updated memo"

	await client.updateTopic({
		topic_id: newTopic.topic,
		memo: newMemo
	})

	// This makes sure that looking up the topic will return the new memo.
	await sleep(2000)

	const updatedTopicInfo = await client.getTopicInfo(newTopic.topic)
	expect(updatedTopicInfo.topicMemo).toBe(newMemo)
}, 20000)
