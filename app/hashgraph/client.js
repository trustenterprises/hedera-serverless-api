import {
	Client,
	MirrorClient,
	Ed25519PrivateKey,
	Ed25519PublicKey,
	AccountBalanceQuery,
	ConsensusTopicInfoQuery,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import Config from "app/config"

// Put this in utils
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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

	/**
	 * Skipping the admin signing of the transaction as this API is accessed through an authKey
	 **/
	async createNewTopic({ memo, enable_private_submit_key }) {
		const client = this.#client
		const transactionResponse = {}

		// TODO: This is used for submitting messages to hedera with the recorded public key
		// const rawPublicKey = "302a300506032b657003210034314146f2f694822547af9007baa32fcc5a6962e7c5141333846a6cf04b64ca"
		// const submitPublicKey = Ed25519PublicKey.fromString(rawPublicKey)
		// console.log(submitPublicKey.toString());

		const transaction = new ConsensusTopicCreateTransaction()

		if (memo) {
			transaction.setTopicMemo(memo)
			transactionResponse.memo = memo
		}

		if (enable_private_submit_key) {
			const submitKey = await Ed25519PrivateKey.generate()
			const submitPublicKey = submitKey.publicKey

			transactionResponse.submitPublicKey = submitPublicKey.toString()
			transaction.setSubmitKey(submitPublicKey)
		}

		const transactionId = await transaction.execute(client)

		console.log(transactionId)
		console.log("start sleep")
		// Is this required?
		await sleep(5000)
		console.log("end sleep")

		// Try old
		// const transactionId = "0.0.116507@1598054187.112000000"

		const receipt = await transactionId.getReceipt(client)
		const topicId = receipt.getConsensusTopicId()

		const { shard, realm, topic } = topicId
		return {
			...transactionResponse,
			topic: `${shard}.${realm}.${topic}`
		}
	}

	// TODO: We might reduce this to
	async getTopicInfo(topicId) {
		// const client = this.#client
		// const topic = await new ConsensusTopicInfoQuery()
		// 	.setTopicId(topicId)
		// 	.execute(client)
		//
		// return topic;
	}

	async accountBalanceQuery() {
		const client = this.#client

		const balance = await new AccountBalanceQuery()
			.setAccountId(Config.accountId)
			.execute(client)

		return { balance: balance.toString() }
	}
}

export default HashgraphClient
