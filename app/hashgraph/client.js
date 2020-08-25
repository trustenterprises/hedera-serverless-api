import {
	Client,
	MirrorClient,
	Ed25519PrivateKey,
	Ed25519PublicKey,
	AccountBalanceQuery,
	ConsensusTopicInfoQuery,
	MirrorConsensusTopicQuery,
	ConsensusTopicCreateTransaction,
	ConsensusTopicUpdateTransaction,
	ConsensusMessageSubmitTransaction,
	TransactionRecordQuery
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"
import sendWebhookMessage from "app/utils/sendWebhookMessage"

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
		const operatorPrivateKey = Ed25519PrivateKey.fromString(Config.privateKey)
		const transaction = new ConsensusTopicCreateTransaction()

		transaction.setAdminKey(operatorPrivateKey.publicKey)

		if (memo) {
			transactionResponse.memo = memo
			transaction.setTopicMemo(memo)
		}

		if (enable_private_submit_key) {
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

	async getTopicInfo(topic_id) {
		const client = this.#client
		const topic = await new ConsensusTopicInfoQuery()
			.setTopicId(topic_id)
			.execute(client)

		return topic
	}

	// Only allow for a topic's memo to be updated
	async updateTopic({ topic_id, memo }) {
		const client = this.#client
		const topic = await new ConsensusTopicUpdateTransaction()
			.setTopicId(topic_id)
			.setTopicMemo(memo)
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

	async sendConsensusMessage({
		reference,
		allow_synchronous_consensus,
		message,
		topic_id
	}) {
		const client = this.#client

		const transaction = await new ConsensusMessageSubmitTransaction()
			.setTopicId(topic_id)
			.setMessage(message)
			.execute(client)

		// Remember to allow for mainnet links for explorer
		const messageTransactionResponse = {
			reference,
			topic_id,
			transaction_id: transaction.toString(),
			explorer_url: `https://ledger-testnet.hashlog.io/tx/${transaction}`
		}

		const syncMessageConsensus = async () => {
			await sleep()

			const record = await new TransactionRecordQuery()
				.setTransactionId(transaction)
				.execute(client)

			const consensusResult = {
				...messageTransactionResponse,
				consensus_timestamp: record.consensusTimestamp
			}

			sendWebhookMessage(consensusResult)

			return consensusResult
		}

		if (allow_synchronous_consensus) {
			return await syncMessageConsensus()
		}

		if (Config.webhookUrl) {
			syncMessageConsensus()
		}

		return messageTransactionResponse
	}
}

export default HashgraphClient
