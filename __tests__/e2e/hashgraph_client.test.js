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

test("The client can create a token", async () => {

	const tokenData = {
		supply: "10",
		name: 'e2e-hedera-token-test',
		symbol: 'te-e2e',
		memo: 'THIS IS A MEMO',
	}

	const token = await client.createToken(tokenData)

	expect(token.tokenId).toBeDefined()
	expect(token.memo).toBe(tokenData.memo)
	expect(token.supply).toBe(tokenData.supply)
	expect(token.symbol).toBe(tokenData.symbol)
	expect(token.name).toBe(tokenData.name)
}, 20000)

test("The client can create an account", async () => {
	const account = await client.createAccount()

	expect(account.accountId).toBeDefined()
	expect(account.encryptedKey).toBeDefined()
	expect(account.publicKey).toBeDefined()
}, 20000)


test("The client can bequest an account with tokens", async () => {

	const tokenData = {
		supply: "10",
		name: 'e2e-hedera-token-test',
		symbol: 'te-e2e',
		memo: 'BEQUEST TOKEN ACCOUNT TEST',
	}

	const token = await client.createToken(tokenData)
	const account = await client.createAccount()

	const bequest = await client.bequestToken({
		encrypted_receiver_key: account.encryptedKey,
		token_id: token.tokenId,
		receiver_id: account.accountId,
		amount: 1
	})

	expect(bequest.amount).toBeDefined()
	expect(bequest.receiver_id).toBeDefined()
}, 20000)
