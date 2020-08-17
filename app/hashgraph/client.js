import {
	Client,
	MirrorClient,
	Ed25519PrivateKey,
	Ed25519PublicKey,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import Config from "app/config"

class HashgraphClient extends HashgraphClientContract {
	// Keep a private internal reference to SDK client
	#client

	constructor() {
		super()

		// if HEDERA_TESTNET or MAINNET use test net, for now just testnet
		this.#client = Client.forTestnet().setOperator(
			Config.accountId,
			Config.privateKey
		)
	}

	// Validate the memo when creating a topic and whether it should be a "private" submit topic
	async createNewTopic() {
		const client = this.#client

		const submitKey = await Ed25519PrivateKey.generate()
		const submitPublicKey = submitKey.publicKey

		// TODO: This is used for submitting messages to hedera with the recorded public key
		// const rawPublicKey = "302a300506032b657003210034314146f2f694822547af9007baa32fcc5a6962e7c5141333846a6cf04b64ca"
		// const submitPublicKey = Ed25519PublicKey.fromString(rawPublicKey)
		// console.log(submitPublicKey.toString());

		const transactionId = await new ConsensusTopicCreateTransaction()
			// .setTopicMemo("HCS topic with submit key") // add a optional memo
			.setSubmitKey(submitPublicKey)
			.execute(client)

		const receipt = await transactionId.getReceipt(client)
		const topicId = receipt.getConsensusTopicId()

		return {
			topicId,
			submitPublicKey: submitPublicKey.toString()
		}
	}
}

export default HashgraphClient
