import {
	PrivateKey,
	AccountBalanceQuery,
	TopicInfoQuery,
	TopicCreateTransaction,
	TopicUpdateTransaction,
	TopicMessageSubmitTransaction,
	TransactionRecordQuery,
	TopicId,
	TokenCreateTransaction,
	Hbar,
	HbarUnit
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"
import Explorer from "app/utils/explorer"
import sendWebhookMessage from "app/utils/sendWebhookMessage"
import Specification from "app/hashgraph/tokens/specifications"

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

	createToken = async tokenCreation => {
		const {
			specification = Specification.Fungible,
			accountId,
			memo,
			name,
			symbol,
			supply,
			requires_kyc = false,
			can_freeze = false
		} = tokenCreation

		const client = this.#client

		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)
		const supplyPrivateKey = PrivateKey.fromString(Config.privateKey)

		const supplyWithDecimals = supply * 10 ** specification.decimals

		const transaction = new TokenCreateTransaction()
			.setTokenName(name)
			.setTokenSymbol(symbol)
			.setTreasuryAccountId(accountId || Config.accountId)
			.setInitialSupply(supplyWithDecimals)
			.setDecimals(specification.decimals)
			.setFreezeDefault(false)
			.setMaxTransactionFee(new Hbar(5, HbarUnit.Hbar)) //Change the default max transaction fee

		if (memo) {
			transaction.setTokenMemo(memo)
			transaction.setTransactionMemo(memo)
		}

		if (requires_kyc) {
			transaction.setKycKey(operatorPrivateKey.publicKey)
		}

		if (can_freeze) {
			transaction.setFreezeKey(operatorPrivateKey.publicKey)
		}

		transaction.freezeWith(client)

		const signTx = await (await transaction.sign(operatorPrivateKey)).sign(
			supplyPrivateKey
		)

		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)

		return {
			name,
			symbol,
			memo,
			reference: specification.reference,
			supply: String(supply),
			supplyWithDecimals: String(supplyWithDecimals),
			tokenId: receipt.tokenId.toString()
		}
	}
}

export default HashgraphClient
