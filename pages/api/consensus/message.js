// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {
	Client,
	MirrorClient,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction
} = require("@hashgraph/sdk")
import sleep from "app/utils/sleep"

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const testnetNodes = {
	// "0.testnet.hedera.com:50211": "0.0.3",
	"1.testnet.hedera.com:50211": "0.0.4",
	"2.testnet.hedera.com:50211": "0.0.5",
	"3.testnet.hedera.com:50211": "0.0.6"
}

async function consensusMessageHandler(req, res) {
	// const client = Client.forTestnet()

	const client = new Client({ network: testnetNodes })

	client.setOperator(
		process.env.HEDERA_ACCOUNT_ID,
		process.env.HEDERA_PRIVATE_KEY
	)

	const transactionId = await new ConsensusTopicCreateTransaction().execute(
		client
	)
	// const transactionReceipt = await transactionId.getReceipt(client)
	// const topicId = transactionReceipt.getConsensusTopicId()

	// We just need
	const topicId = "0.0.133351"

	// await sleep(5000)
	//
	const myMirrorClient = new MirrorClient(
		"hcs.testnet.mirrornode.hedera.com:5600"
		// '0.testnet.hedera.com:50211'
	)
	// //
	const subscription = new MirrorConsensusTopicQuery()
		.setTopicId(topicId)
		.setLimit(1)
		// .setStartTime(10)
		// .setStartTime(19)
		.subscribe(
			myMirrorClient,
			message => {
				// console.log(message);
				// subscription.unsubscribe()

				console.log("received from mirror: ", message.toString())

				res.statusCode = 200
				res.json({ message })
			},
			error => {
				console.log("MirrorConsensusTopicQuery errorroorroo")
				console.log("Error: ", error.toString())
			}
		)

	const receipt = await (
		await new ConsensusMessageSubmitTransaction()
			.setTopicId(topicId)
			.setMessage(`Hedera is coolbeans, happy.`)
			.execute(client)
	).getReceipt(client)

	console.log(receipt)

	// res.json({ receipt })
}

export default consensusMessageHandler
