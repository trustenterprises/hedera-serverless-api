import {
	PrivateKey,
	AccountBalanceQuery,
	TopicInfoQuery,
	TopicCreateTransaction,
	TopicUpdateTransaction,
	TopicMessageSubmitTransaction,
	TransactionRecordQuery,
	TopicId
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"
import Explorer from "app/utils/explorer"
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
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)
		const transaction = new TopicCreateTransaction()

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

		return {
			...transactionResponse,
			topic: receipt.topicId.toString()
		}
	}

	async getTopicInfo(topic_id) {
		const client = this.#client

		const topic = await new TopicInfoQuery()
			.setTopicId(topic_id)
			.execute(client)

		return topic
	}

	// Only allow for a topic's memo to be updated
	async updateTopic({ topic_id, memo }) {
		const client = this.#client
		const topic = await new TopicUpdateTransaction()
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

		return { balance: parseFloat(balance.hbars.toString()) }
	}

	async sendConsensusMessage({
		reference,
		allow_synchronous_consensus,
		message,
		topic_id
	}) {
		const client = this.#client

		const transaction = await new TopicMessageSubmitTransaction({
			topicId: TopicId.fromString(topic_id),
			message: message
		}).execute(client)

		// Remember to allow for mainnet links for explorer
		const messageTransactionResponse = {
			reference,
			topic_id,
			transaction_id: transaction.transactionId.toString(),
			explorer_url: Explorer.getExplorerUrl(transaction.transactionId)
		}

		const syncMessageConsensus = async () => {
			await sleep()

			const record = await new TransactionRecordQuery()
				.setTransactionId(transaction.transactionId)
				.execute(client)

			const { seconds, nanos } = record.consensusTimestampstamp

			const consensusResult = {
				...messageTransactionResponse,
				consensus_timestamp: {
					seconds: seconds.toString(),
					nanos: nanos.toString()
				},
				reference: reference
			}

			await sendWebhookMessage(consensusResult)

			return consensusResult
		}

		if (allow_synchronous_consensus) {
			return await syncMessageConsensus()
		}

		if (Config.webhookUrl) {
			await syncMessageConsensus()
		}

		return messageTransactionResponse
	}
}

export default HashgraphClient
