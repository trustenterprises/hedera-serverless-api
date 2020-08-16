// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {
	Client,
	MirrorClient,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction
} = require("@hashgraph/sdk")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function consensusMessageHandler(req, res) {
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

	// await sleep(5000)

	const myMirrorClient = new MirrorClient(
		"hcs.testnet.mirrornode.hedera.com:5600"
	)

	new MirrorConsensusTopicQuery()
		.setTopicId(topicId)
		.setLimit(1)
		.subscribe(
			myMirrorClient,
			message => {
				// console.log("received from mirror: ", message.toString()),

				res.statusCode = 200
				res.json({ message })
			},
			error => console.log("Error: ", error.toString())
		)

	for (var i = 0; i < 10; i++) {
		var hcsMessage = await new ConsensusMessageSubmitTransaction()
			.setTopicId(topicId)
			.setMessage("This is data")
			.execute(client)
		var hcsMessageReceipt = await hcsMessage.getReceipt(client)

		console.log(`Send message ${i}: ${hcsMessageReceipt.toString()}`)
	}
}

export default consensusMessageHandler
