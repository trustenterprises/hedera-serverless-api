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
	HbarUnit,
	AccountCreateTransaction,
	TokenAssociateTransaction,
	TransferTransaction,
	TokenMintTransaction,
	Status,
	TokenBurnTransaction
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"
import Encryption from "app/utils/encryption"
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

		transaction
			.setAdminKey(operatorPrivateKey.publicKey)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))

		if (memo) {
			transactionResponse.memo = memo
			transaction.setTopicMemo(memo)
		}

		if (enable_private_submit_key) {
			transaction.setSubmitKey(operatorPrivateKey.publicKey)
		}

		const transactionId = await transaction.execute(client)
		const receipt = await transactionId.getReceipt(client)

		await sleep(3000)

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
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
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
		})
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.execute(client)

		await transaction.getReceipt(client)

		// Remember to allow for mainnet links for explorer
		const messageTransactionResponse = {
			reference,
			topic_id,
			transaction_id: transaction.transactionId.toString(),
			explorer_url: Explorer.getExplorerUrl(transaction.transactionId)
		}

		const syncMessageConsensus = async () => {
			// await sleep()

			const record = await new TransactionRecordQuery()
				.setTransactionId(transaction.transactionId)
				.execute(client)

			const { seconds, nanos } = record.consensusTimestamp

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

		// TODO: This is problematic.
		// if (allow_synchronous_consensus) {
		// 	return await syncMessageConsensus()
		// }

		if (Config.webhookUrl) {
			await syncMessageConsensus()
		}

		return messageTransactionResponse
	}

	// Before transferring token to other account association is require
	async associateToAccount({ privateKey, tokenIds, accountId }) {
		const client = this.#client

		const transaction = await new TokenAssociateTransaction()
			.setAccountId(accountId)
			.setTokenIds(tokenIds)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.freezeWith(client)

		const accountPrivateKey = PrivateKey.fromString(privateKey)
		const signTx = await transaction.sign(accountPrivateKey)
		const executeTx = await signTx.execute(client)

		// Wait to finish for consensus
		await executeTx.getReceipt(client)

		return executeTx
	}

	bequestToken = async ({
		specification = Specification.Fungible,
		encrypted_receiver_key,
		token_id,
		receiver_id,
		amount
	}) => {
		const client = this.#client

		// Extract PV from encrypted
		const privateKey = await Encryption.decrypt(encrypted_receiver_key)

		// Associate with the token
		await this.associateToAccount({
			privateKey,
			tokenIds: [token_id],
			accountId: receiver_id
		})

		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(Config.accountId)
			.execute(client)

		const token = JSON.parse(tokens.toString())[token_id]
		const adjustedAmountBySpec = amount * 10 ** specification.decimals

		if (token < adjustedAmountBySpec) {
			return false
		}

		const transfer = await new TransferTransaction()
			.addTokenTransfer(token_id, Config.accountId, -adjustedAmountBySpec)
			.addTokenTransfer(token_id, receiver_id, adjustedAmountBySpec)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.execute(client)

		return {
			amount,
			receiver_id,
			transaction_id: transfer.transactionId.toString()
		}
	}

	createAccount = async () => {
		const privateKey = await PrivateKey.generate()
		const publicKey = privateKey.publicKey
		const client = this.#client
		const transaction = new AccountCreateTransaction()
			.setKey(publicKey)
			.setInitialBalance(0.1)

		const txResponse = await transaction.execute(client)
		const receipt = await txResponse.getReceipt(client)
		const accountId = receipt.accountId.toString()
		const encryptedKey = await Encryption.encrypt(privateKey.toString())

		return {
			accountId,
			encryptedKey,
			publicKey: publicKey.toString()
		}
	}

	getTokenBalance = async ({
		specification = Specification.Fungible,
		account_id,
		token_id
	}) => {
		const client = this.#client
		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(account_id)
			.execute(client)

		const token = JSON.parse(tokens.toString())[token_id]

		const expectedValue = token / 10 ** specification.decimals

		return {
			token_id,
			amount: expectedValue || 0,
			raw_amount: token || 0,
			decimals: specification.decimals
		}
	}

	// TODO: check for general failures and token assoc issues (using Venly)
	sendTokens = async ({
		specification = Specification.Fungible,
		token_id,
		receiver_id,
		amount
	}) => {
		const client = this.#client

		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(Config.accountId)
			.execute(client)

		const token = JSON.parse(tokens.toString())[token_id]
		const adjustedAmountBySpec = amount * 10 ** specification.decimals

		if (token < adjustedAmountBySpec) {
			return {
				error: "Not enough token balance to send to recipient"
			}
		}

		try {
			const transfer = await new TransferTransaction()
				.addTokenTransfer(token_id, Config.accountId, -adjustedAmountBySpec)
				.addTokenTransfer(token_id, receiver_id, adjustedAmountBySpec)
				.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
				.execute(client)

			// Wait for receipt, successful transaction
			await transfer.getReceipt(client)

			return {
				amount,
				receiver_id,
				transaction_id: transfer.transactionId.toString()
			}
		} catch (e) {
			return {
				error:
					"Transfer failed, ensure that the recipient account is valid and has associated to the token"
			}
		}
	}

	mintTokens = async ({
		specification = Specification.Fungible,
		tokenId,
		amount
	}) => {
		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)

		const adjustedAmountBySpec = amount * 10 ** specification.decimals

		const transaction = await new TokenMintTransaction()
			.setTokenId(tokenId)
			.setAmount(adjustedAmountBySpec)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.freezeWith(client)

		const signTx = await transaction.sign(operatorPrivateKey)
		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)
		const supply = receipt.totalSupply.low / 10 ** specification.decimals

		return {
			supply,
			tokenId,
			amount
		}
	}

	burnTokens = async ({
		specification = Specification.Fungible,
		tokenId,
		amount
	}) => {
		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)

		const adjustedAmountBySpec = amount * 10 ** specification.decimals

		const transaction = await new TokenBurnTransaction()
			.setTokenId(tokenId)
			.setAmount(adjustedAmountBySpec)
			.freezeWith(client)

		const signTx = await transaction.sign(operatorPrivateKey)
		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)
		const supply = receipt.totalSupply.low / 10 ** specification.decimals

		return {
			supply,
			tokenId,
			amount
		}
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
			.setFeeScheduleKey(operatorPrivateKey)
			.setSupplyKey(operatorPrivateKey)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar)) //Change the default max transaction fee

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
