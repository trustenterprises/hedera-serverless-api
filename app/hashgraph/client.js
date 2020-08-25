import {
	Client,
	MirrorClient,
	Ed25519PrivateKey,
	Ed25519PublicKey,
	AccountBalanceQuery,
	ConsensusTopicInfoQuery,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusMessageSubmitTransaction,
	TransactionRecordQuery
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"

class HashgraphClient extends HashgraphClientContract {
	// Keep a private internal reference to SDK client
	#client

	constructor() {
		super()

		this.#client = HashgraphNodeNetwork.getNodeNetworkClient()
	}

	/**
	 * Skipping the admin signing of the transaction as this API is accessed through an authKey
	 **/
	async createNewTopic({ memo, enable_private_submit_key }) {
		const client = this.#client
		const transactionResponse = {}

		const transaction = new ConsensusTopicCreateTransaction()

		if (memo) {
			transactionResponse.memo = memo
			transaction.setTopicMemo(memo)
		}

		if (enable_private_submit_key) {
			const operatorPrivateKey = Ed25519PrivateKey.fromString(Config.privateKey)

			transaction.setSubmitKey(operatorPrivateKey.publicKey)
		}

		const transactionId = await transaction.execute(client)
		const receipt = await transactionId.getReceipt(client)
		const topicId = receipt.getConsensusTopicId()
		const { shard, realm, topic } = topicId

		return {
			...transactionResponse,
			topic: `${shard}.${realm}.${topic}`
		}
	}

	async getTopicInfo(topicId) {
		const client = this.#client
		const topic = await new ConsensusTopicInfoQuery()
			.setTopicId(topicId)
			.execute(client)

		return topic
	}

	async accountBalanceQuery() {
		const client = this.#client

		const balance = await new AccountBalanceQuery()
			.setAccountId(Config.accountId)
			.execute(client)

		return { balance: balance.toString() }
	}

	// Message, topicId, allow_synchronous_consensus
	// Private submission is automatically handled
	async sendConsensusMessage({
		allow_synchronous_consensus,
		message,
		topic_id
	}) {
		const client = this.#client

		console.log(topic_id)

		const transaction = await new ConsensusMessageSubmitTransaction()
			.setTopicId(topic_id)
			.setMessage(message)
			.execute(client)

		// const receipt = await transaction.getReceipt(client)
		// This will be used for the webhook or if allow_synchronous_consensus is set

		// if allow_synchronous_consensus is true skip this
		if (!allow_synchronous_consensus) {
			return { transaction_id: transaction }
		}

		await sleep()

		const record = await new TransactionRecordQuery()
			.setTransactionId(transaction)
			.execute(client)

		const { consensusTimestamp, transactionId } = record

		// The response will be here, I may include a wait, if no webhook.

		console.log(record)

		return {
			topic_id,
			consensus_timestamp: consensusTimestamp,
			transaction_id: transactionId
		}

		return { transaction_id: transaction }
	}
}

export default HashgraphClient
