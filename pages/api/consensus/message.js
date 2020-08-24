// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {
	Client,
	MirrorClient,
	MirrorConsensusTopicQuery,
	TransactionRecordQuery,
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
	const client = new Client({ network: testnetNodes })

	client.setOperator(
		process.env.HEDERA_ACCOUNT_ID,
		process.env.HEDERA_PRIVATE_KEY
	)

	// We just need
	const topicId = "0.0.133351"

	const transaction = await new ConsensusMessageSubmitTransaction()
		.setTopicId(topicId)
		.setMessage(`Hedera is coolbeans, toad!`)
		.execute(client)

	// const receipt = await transaction.getReceipt(client)

	// This will be used for the webhook

	await sleep()

	const record = await new TransactionRecordQuery()
		.setTransactionId(transaction)
		.execute(client)

	// The response will be here, I may include a wait, if no webhook.

	console.log(record)

	const data = {
		topicId,
		consensusTimestamp: record.consensusTimestamp,
		txId: record.transactionId
	}

	res.json({ data })
}

export default consensusMessageHandler
