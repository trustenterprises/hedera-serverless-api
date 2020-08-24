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

	// We just need
	// const topicId = "0.0.133351"

	// await sleep(5000)
	//
	// const myMirrorClient = new MirrorClient(
	// 	// "hcs.testnet.mirrornode.hedera.com:5600",
	// 	// '0.testnet.hedera.com:50211'
	// )
	//
	// const subscription = new MirrorConsensusTopicQuery()
	// 	.setTopicId(topicId)
	// 	.setLimit(1)
	// 	// .setStartTime(16)
	// 	.subscribe(
	// 		myMirrorClient,
	// 		message => {
	// 			// console.log(message);
	// 			subscription.unsubscribe()
	//
	// 			console.log("received from mirror: ", message.toString()),
	//
	// 			res.statusCode = 200
	// 			res.json({ message })
	// 		},
	// 		error => console.log("Error: ", error.toString())
	// 	)

		const receipt = await (await new ConsensusMessageSubmitTransaction()
	            .setTopicId(topicId)
	            .setMessage(`Tetris for jeff`)
	            .execute(client))
	            .getReceipt(client);

	console.log(receipt);

	// Confirmation 1 - Executing will run a "precheck"
   // const transactionId = await new CryptoTransferTransaction()
   //     .addSender(operatorAccount, 0)
   //     .addRecipient("0.0.1", 0)
   //     .setTransactionMemo("testing :)")
   //     .execute(client);

   // Confirmation 2 - Ask for a receipt
   // console.log(`attempting to get receipt for transaction id = ${transactionId}\n`);
   // const receipt = await transactionId.getReceipt(client);
   // console.log(`transaction ${
   //     transactionId
   // } receipt = ${
   //     JSON.stringify(receipt)
   // }\n`);
	 //
   // // Confirmation 3 - Ask for a record
   // // Note: these cost HBAR! View the network fees at docs.hedera.com
   // // You should only request these when it's worth paying for the extra details it provides
   // console.log(`attempting to get record for transaction id = ${transactionId}\n`);
   // const record = await transactionId.getRecord(client);
   // console.log(`transaction ${
   //     transactionId
   // } record = ${
   //     JSON.stringify(record)
   // }\n`);

	// for (var i = 0; i < 10; i++) {
	// 	var hcsMessage = await new ConsensusMessageSubmitTransaction()
	// 		.setTopicId(topicId)
	// 		// .setMessage({ data: "This is data" })
	// 		.setMessage("This is data :-)")
	// 		.execute(client)
	// 	// var hcsMessageReceipt = await hcsMessage.getReceipt(client)
	//
	// 	// console.log(`Send message ${i}: ${hcsMessageReceipt.toString()}`)
	// }
}

export default consensusMessageHandler
