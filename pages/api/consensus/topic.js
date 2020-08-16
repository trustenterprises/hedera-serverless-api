// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {
	Client,
	MirrorClient,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction
} = require("@hashgraph/sdk")

async function consensusMessageHandler(req, res) {
	// The Hedera JS SDK makes this reallyyy easy!
	const client = Client.forTestnet()
	client.setOperator(
		process.env.HEDERA_ACCOUNT_ID,
		process.env.HEDERA_PRIVATE_KEY
	)

	const transactionId = await new ConsensusTopicCreateTransaction().execute(
		client
	)
	const transactionReceipt = await transactionId.getReceipt(client)
	const topicId = transactionReceipt.getConsensusTopicId()

	res.statusCode = 200
	res.json({ topicId })
	// //Create new keys
	// const newAccountPrivateKey = await Ed25519PrivateKey.generate();
	// const newAccountPublicKey = newAccountPrivateKey.publicKey;
	//
	// //Create a new account with 1,000 tinybar starting balance
	// const newAccountTransactionId = await new AccountCreateTransaction()
	//     .setKey(newAccountPublicKey)
	//     .setInitialBalance(1000)
	//     .execute(client);
	//
	// //Get the account ID
	// const getReceipt = await newAccountTransactionId.getReceipt(client);
	// const newAccountId = getReceipt.getAccountId();
	//
	// console.log("The new account ID is: " +newAccountId);
	//
	//
	// res.statusCode = 200
	// res.json({ name: newAccountId })
}

export default consensusMessageHandler
