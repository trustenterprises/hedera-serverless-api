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
	TokenBurnTransaction,
	TokenType,
	CustomRoyaltyFee,
	CustomFixedFee,
	TokenSupplyType,
	NftId
} from "@hashgraph/sdk"
import HashgraphClientContract from "./contract"
import HashgraphNodeNetwork from "./network"
import Config from "app/config"
import sleep from "app/utils/sleep"
import Encryption from "app/utils/encryption"
import Explorer from "app/utils/explorer"
import sendWebhookMessage from "app/utils/sendWebhookMessage"
import Mirror from "app/utils/mirrornode"
import Specification from "app/hashgraph/tokens/specifications"
import Batchable from "app/utils/batchable"

class HashgraphClient extends HashgraphClientContract {
	// Keep a private internal reference to SDK client
	#client

	constructor() {
		super()

		this.#client = HashgraphNodeNetwork.getNodeNetworkClient()
	}

	ensureDecimalsForClientCall(specification, decimals = undefined) {
		// If decimals are not set for a HAPI call return the base Default Specification values
		if (isNaN(decimals)) {
			return specification.decimals
		}

		return decimals
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

		// Wait to finish for consensus and catch if association has already happened
		try {
			await executeTx.getReceipt(client)
		} catch (_) {
			console.warn(
				`Account: ${accountId} already associated to token - ${tokenIds}`
			)
		}

		return executeTx
	}

	bequestToken = async ({
		specification = Specification.DovuAssetFungible,
		encrypted_receiver_key,
		token_id,
		receiver_id,
		amount,
		decimals
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

		try {
			const transfer = await new TransferTransaction()
				.addTokenTransfer(token_id, Config.accountId, -amount)
				.addTokenTransfer(token_id, receiver_id, amount)
				.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
				.execute(client)

			return {
				amount,
				receiver_id,
				transaction_id: transfer.transactionId.toString()
			}
		} catch (e) {
			return {
				error: "Token failed to transfer"
			}
		}
	}

	createAccount = async ({ hasAutomaticAssociations = true } = {}) => {
		const privateKey = await PrivateKey.generate()
		const publicKey = privateKey.publicKey
		const client = this.#client
		const transaction = new AccountCreateTransaction()
			.setKey(publicKey)
			.setInitialBalance(0.1)

		if (hasAutomaticAssociations) {
			transaction.setMaxAutomaticTokenAssociations(10)
		}

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
		token_id,
		decimals
	}) => {
		const client = this.#client
		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(account_id)
			.execute(client)

		const token = JSON.parse(tokens.toString())[token_id]

		// Token decimal pass through
		const tokenDecimals = this.ensureDecimalsForClientCall(
			specification,
			decimals
		)

		const expectedValue = token / 10 ** tokenDecimals

		return {
			token_id,
			amount: expectedValue || 0,
			raw_amount: token || 0,
			decimals: tokenDecimals
		}
	}

	hasTokenHoldings = async ({ account_id, token_ids }) => {
		const client = this.#client
		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(account_id)
			.execute(client)

		const allTokens = JSON.parse(tokens.toString())

		const amountOfTokensHeld = token_ids.filter(token_id => allTokens[token_id])
			.length

		return {
			token_ids,
			has_tokens: amountOfTokensHeld === token_ids.length
		}
	}

	// TODO: check for general failures and token assoc issues (using Venly)
	sendTokens = async ({
		specification = Specification.Fungible,
		token_id,
		receiver_id,
		amount,
		decimals
	}) => {
		const client = this.#client

		const { tokens } = await new AccountBalanceQuery()
			.setAccountId(Config.accountId)
			.execute(client)

		// Token decimal pass through
		const tokenDecimals = this.ensureDecimalsForClientCall(
			specification,
			decimals
		)

		const token = JSON.parse(tokens.toString())[token_id]
		const adjustedAmountBySpec = amount * 10 ** tokenDecimals

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
		amount,
		decimals
	}) => {
		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)

		// Token decimal pass through
		const tokenDecimals = this.ensureDecimalsForClientCall(
			specification,
			decimals
		)

		const adjustedAmountBySpec = amount * 10 ** tokenDecimals

		const transaction = await new TokenMintTransaction()
			.setTokenId(tokenId)
			.setAmount(adjustedAmountBySpec)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.freezeWith(client)

		const signTx = await transaction.sign(operatorPrivateKey)
		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)
		const supply = receipt.totalSupply.low / 10 ** tokenDecimals

		return {
			supply,
			tokenId,
			amount
		}
	}

	burnTokens = async ({
		specification = Specification.Fungible,
		tokenId,
		amount,
		decimals
	}) => {
		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)

		// Token decimal pass through
		const tokenDecimals = this.ensureDecimalsForClientCall(
			specification,
			decimals
		)

		const adjustedAmountBySpec = amount * 10 ** tokenDecimals

		const transaction = await new TokenBurnTransaction()
			.setTokenId(tokenId)
			.setAmount(adjustedAmountBySpec)
			.freezeWith(client)

		const signTx = await transaction.sign(operatorPrivateKey)
		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)
		const supply = receipt.totalSupply.low / 10 ** tokenDecimals

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
			decimals,
			requires_kyc = false,
			can_freeze = false
		} = tokenCreation

		const client = this.#client

		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)
		const supplyPrivateKey = PrivateKey.fromString(Config.privateKey)

		// Token decimal pass through
		const tokenDecimals = this.ensureDecimalsForClientCall(
			specification,
			decimals
		)

		const supplyWithDecimals = supply * 10 ** tokenDecimals

		const transaction = new TokenCreateTransaction()
			.setTokenName(name)
			.setTokenSymbol(symbol)
			.setTreasuryAccountId(accountId || Config.accountId)
			.setInitialSupply(supplyWithDecimals)
			.setDecimals(tokenDecimals)
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
			decimals: tokenDecimals,
			reference: specification.reference,
			supply: String(supply),
			supplyWithDecimals: String(supplyWithDecimals),
			tokenId: receipt.tokenId.toString()
		}
	}

	createNonFungibleToken = async nftCreation => {
		const account_id = Config.accountId

		// 🚨 You may remove this if you don't want support from Matt 😇
		const trustEnterprisesTreasuryAccountId = Config.royaltyFeeTreasury

		const {
			// Required parameters (TODO: Remove defaults)
			collection_name = "example_collection_name",
			symbol = "EXAMPLE",
			supply = 100,

			// Enable custom fees, default to 5% to API treasury account
			allow_custom_fees = true,
			royalty_account_id = account_id,
			royalty_fee = 0.05,

			// Optional fallback for custom fees
			fallback_fee = 0,

			// Considered dangerous and opt-in only
			enable_unsafe_keys = false
		} = nftCreation

		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)

		const transaction = new TokenCreateTransaction()
			.setTokenName(collection_name)
			.setTokenType(TokenType.NonFungibleUnique)
			.setSupplyType(TokenSupplyType.Finite)
			.setSupplyKey(operatorPrivateKey)
			.setTokenSymbol(symbol)
			.setTreasuryAccountId(account_id)
			.setMaxSupply(supply)
			.setInitialSupply(0)
			.setDecimals(0)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar)) //Change the default max transaction fee

		if (allow_custom_fees) {
			const customFee = new CustomRoyaltyFee()
				.setNumerator(1)
				.setDenominator(1 / royalty_fee)
				.setFeeCollectorAccountId(royalty_account_id)

			// Ensure that a fallback fee in HBARs is optional
			if (fallback_fee) {
				customFee.setFallbackFee(
					new CustomFixedFee()
						.setHbarAmount(new Hbar(fallback_fee))
						.setFeeCollectorAccountId(royalty_account_id)
				)
			}

			// Takes an additional 5% of royalties
			const trustEnterprisesFee = new CustomRoyaltyFee()
				.setNumerator(1)
				.setDenominator(1 / (royalty_fee / Config.royaltyFeeDivisor))
				.setFeeCollectorAccountId(trustEnterprisesTreasuryAccountId)

			transaction.setCustomFees([customFee, trustEnterprisesFee])
		}

		// WARN: enable these at your own risk!
		if (enable_unsafe_keys) {
			transaction.setAdminKey(operatorPrivateKey)
			transaction.setFreezeKey(operatorPrivateKey)
			transaction.setWipeKey(operatorPrivateKey)
		}

		// The final countdown... brr 🥶
		transaction.freezeWith(client)

		const signTx = await transaction.sign(operatorPrivateKey)
		const txResponse = await signTx.execute(client)
		const receipt = await txResponse.getReceipt(client)

		return {
			collection_name,
			symbol,
			max_supply: supply,
			treasury_id: account_id,
			token_id: receipt.tokenId.toString(),
			collection_considered_unsafe: !!enable_unsafe_keys
		}
	}

	mintNonFungibleToken = async ({ token_id, amount = 1, cid }) => {
		const client = this.#client
		const operatorPrivateKey = PrivateKey.fromString(Config.privateKey)
		const buffer = Buffer.from(`ipfs://${cid}`, "utf-8")

		// Batch up to 10 NFT mints at a time, need to parseInt as it thinks its a string.
		const nftBatchBuffer = Array(parseInt(amount)).fill(buffer)

		// Mints up to ten as a batch at a time
		const transaction = await new TokenMintTransaction()
			.setTokenId(token_id)
			.setMetadata(nftBatchBuffer)
			.setMaxTransactionFee(new Hbar(100, HbarUnit.Hbar))
			.freezeWith(client)

		const signedTx = await transaction.sign(operatorPrivateKey)

		// TODO: If there are issues in the future we may need to await the receipt to check.
		const txResponse = await signedTx.execute(client)

		try {
			const receipt = await txResponse.getReceipt(client)
			const minted_serial_numbers = receipt.serials.map(serial => serial.low)

			return {
				token_id,
				amount,
				minted_serial_numbers
			}
		} catch (e) {
			return {
				errors: [
					"Something went wrong, likely that the token id probably incorrect"
				]
			}
		}
	}

	/**
	 * Attempt to transfer a single NFT via a serial number from the
	 * connected treasury to an external account.
	 *
	 * We have basic detection for whether a treasury holds the NFT before transfer
	 * through the mirrornode.
	 *
	 * @param token_id
	 * @param receiver_id
	 * @param serial_number
	 * @returns {Promise<{error: string}|{transaction_id: string, amount: (number|*), receiver_id}>}
	 */
	transferNft = async ({ token_id, receiver_id, serial_number }) => {
		const client = this.#client

		const hasNft = await Mirror.checkTreasuryHasNft(token_id, serial_number)

		if (hasNft?.error) {
			return hasNft
		}

		if (!hasNft) {
			return {
				error: [
					`The treasury does not hold the token ${token_id} of serial ${serial_number}`
				]
			}
		}

		try {
			const transfer = await new TransferTransaction()
				.addNftTransfer(
					new NftId(token_id, serial_number),
					Config.accountId,
					receiver_id
				)
				.execute(client)

			// Wait for receipt, successful transaction
			await transfer.getReceipt(client)

			return {
				token_id,
				serial_number,
				receiver_id,
				transaction_id: transfer.transactionId.toString()
			}
		} catch (e) {
			return {
				token_id,
				error: [
					"Transfer failed, ensure that the recipient account is valid and has associated to the token"
				]
			}
		}
	}

	/**
	 * Given a token id and a receiver, attempt to send tokens based on limit
	 * return status of transfer.
	 *
	 * @param token_id
	 * @param receiver_id
	 * @param ser
	 * @returns {Promise<void>}
	 */
	multipleNftTransfer = async ({ token_id, receiver_id, serials }) => {
		const client = this.#client

		const transfer = await new TransferTransaction()

		serials.map(serial => {
			transfer.addNftTransfer(
				new NftId(token_id, serial),
				Config.accountId,
				receiver_id
			)
		})

		// We are making the assumption that if the transaction is successful NFTs are sent
		try {
			const tx = await transfer.execute(client)

			await tx.getReceipt(client)

			return {
				serials,
				total: serials.length
			}
		} catch (e) {
			return {
				error: e.message.toString(),
				total: 0
			}
		}
	}

	/**
	 * Attempt to transfer a batch of NFTs, of a particular amount
	 *
	 * We check that
	 *
	 * @param token_id
	 * @param receiver_id
	 * @param amount
	 * @returns {Promise<{error: string}|{transaction_id: string, amount: (number|*), receiver_id}>}
	 */
	batchTransferNft = async ({ token_id, receiver_id, amount }) => {
		const hasNft = await Mirror.checkTreasuryHasNftAmount(token_id, amount)

		if (!hasNft) {
			return {
				errors: [
					`The treasury does not hold the amount of NFTs of id ${token_id} to do the required batch transfer`
				]
			}
		}

		const transferCycleLimits = Batchable.nftTransfer(amount)

		// Required recur fn needed for pagination
		const sendNftTransaction = async (limit, paginationLink) => {
			const nfts = await Mirror.fetchNftIdsForBatchTransfer(
				token_id,
				limit,
				paginationLink
			)

			const transfer = await this.multipleNftTransfer({
				token_id,
				receiver_id,
				serials: nfts.serials
			})

			return {
				...nfts,
				...transfer
			}
		}

		const cycleBatchTransfers = async (cycle, results = [], paginationLink) => {
			if (!cycle.length) {
				return results
			}

			const limit = cycle.shift()

			const transfer = await sendNftTransaction(limit, paginationLink)

			results.push(transfer)

			return cycleBatchTransfers(cycle, results, transfer.link)
		}

		const results = await cycleBatchTransfers(transferCycleLimits)

		const errors = results.map(e => e.errors).filter(e => e)

		if (errors.length) {
			return {
				errors
			}
		}

		return {
			results,
			expected: amount,
			actual_sent: results.map(e => e.total).reduce((e, n) => e + n)
		}
	}
}

export default HashgraphClient
