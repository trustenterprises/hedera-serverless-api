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

test("The client can mint a token and increase supply", async () => {

	const tokenData = {
		supply: "10",
		name: 'e2e-hedera-mint-more-tokens',
		symbol: 'te-e2e',
		memo: 'THIS IS A MEMO',
	}

	const token = await client.createToken(tokenData)
	const tokenMint = await client.mintTokens({ tokenId: token.tokenId, amount: 1 })

	expect(tokenMint.supply).toBe(11)
	expect(tokenMint.amount).toBe(1)
	expect(tokenMint.tokenId).toBe(token.tokenId)

}, 20000)

test("The client can mint a token and decrease supply", async () => {
	const tokenData = {
		supply: "10",
		name: 'e2e-hedera-mint-more-tokens',
		symbol: 'te-e2e',
		memo: 'THIS IS A MEMO',
	}

	const token = await client.createToken(tokenData)
	const tokenMint = await client.burnTokens({ tokenId: token.tokenId, amount: 1 })

	expect(tokenMint.supply).toBe(9)
	expect(tokenMint.amount).toBe(1)
	expect(tokenMint.tokenId).toBe(token.tokenId)
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
	expect(bequest.transaction_id).toBeDefined()

	// Send more tokens, as a user is associated, catch the issue.
	await client.bequestToken({
		encrypted_receiver_key: account.encryptedKey,
		token_id: token.tokenId,
		receiver_id: account.accountId,
		amount: 1
	})
}, 20000)

// Venly test
test("The client can send a token to venly", async () => {

	const tokenId = '0.0.15657534'
	const accountId = '0.0.15657776'

	const initialBalance = await client.getTokenBalance({
		account_id: accountId,
		token_id: tokenId,
	})

	// TODO: This test will fail one day.
	const bequest = await client.sendTokens({
		token_id: tokenId,
		receiver_id: accountId, // This is a specific venly wallet
		amount: 0.00001
	})

	const newBalance = await client.getTokenBalance({
		account_id: accountId,
		token_id: tokenId,
	})

	expect(initialBalance.amount + 0.00001).toBeLessThanOrEqual(newBalance.amount) // floaty hack.

	expect(bequest.amount).toBeDefined()
	expect(bequest.receiver_id).toBeDefined()
	expect(bequest.transaction_id).toBeDefined()

}, 20000)

test("This test will check if a wallet holds different tokens", async () => {

	const tokenData = {
		supply: "10",
		name: 'example token',
		symbol: 'te-e2e',
		memo: 'DIFFERENT TOKEN ACCOUNT TEST',
	}

	const token = await client.createToken(tokenData)
	const token2 = await client.createToken(tokenData)

	const account = await client.createAccount()

	await client.bequestToken({
		encrypted_receiver_key: account.encryptedKey,
		token_id: token.tokenId,
		receiver_id: account.accountId,
		amount: 1
	})

	const hasTokensFalse = await client.hasTokenHoldings({
		account_id: account.accountId,
		token_ids: [ token2.tokenId, token.tokenId ]
	})

	expect(hasTokensFalse.has_tokens).toBeFalsy()

	await client.bequestToken({
		encrypted_receiver_key: account.encryptedKey,
		token_id: token2.tokenId,
		receiver_id: account.accountId,
		amount: 1
	})

	const hasTokensTrue = await client.hasTokenHoldings({
		account_id: account.accountId,
		token_ids: [ token2.tokenId, token.tokenId ]
	})

	expect(hasTokensTrue.has_tokens).toBeTruthy()

}, 20000)


test("This test will create a token with explicit decimals", async () => {

	const decimals = 2;

	const tokenData = {
		supply: "10",
		name: 'example decimal token',
		symbol: 'ted-e2e',
		memo: 'DECIMAL TOKEN ACCOUNT TEST',
		decimals
	}

	const token = await client.createToken(tokenData)

	const account = await client.createAccount({
		hasAutomaticAssociations: false
	})

	await client.bequestToken({
		encrypted_receiver_key: account.encryptedKey,
		token_id: token.tokenId,
		receiver_id: account.accountId,
		amount: 1,
		decimals
	})

	// MUST AWAIT CONSENSUS 🙃
	await sleep(5000)

	const initialBalance = await client.getTokenBalance({
		account_id: account.accountId,
		token_id: token.tokenId,
		decimals
	})

	expect(initialBalance.amount).toBe(1)

}, 20000)
