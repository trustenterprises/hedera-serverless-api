import Config from "app/config"
import axios from "axios"
import sleep from "app/utils/sleep"
import Status from "app/constants/status"

const mirrornode = Config.mirrornodeUrl

const queryTokenInfo = token_id => `${mirrornode}/api/v1/tokens/${token_id}`
const queryNftAccountOwner = (token_id, serial) =>
	`${mirrornode}/api/v1/tokens/${token_id}/nfts/${serial}`
const queryNftForOwner = (token_id, account_id) =>
	`${mirrornode}/api/v1/tokens/${token_id}/nfts/?account.id=${account_id}`
const queryTreasuryTokenBalance = (token_id, account_id) =>
	`${mirrornode}/api/v1/tokens/${token_id}/balances/?account.id=${account_id}`
const getNftByLimit = (token_id, account_id, limit = 20) =>
	`${mirrornode}/api/v1/tokens/${token_id}/nfts?account.id=${account_id}&order=asc&limit=${limit}`
const queryReq = next => `${mirrornode}${next}`

const MIRRORNODE_WAIT_MS = 500
const MIRRORNODE_TRIES = 5

/**
 * @param {string} query
 * @param {number} tries
 * @param {number} attempts
 */
const retryableMirrorQuery = async (
	query,
	tries = MIRRORNODE_TRIES,
	attempts = 1
) => {
	try {
		return await axios.get(query)
	} catch (e) {
		if (e.response.status === Status.NOT_FOUND) {
			return {
				error: [
					"Expected resource was not found, did you include a parameter like an NFT ID that isn't on ledger?"
				]
			}
		}

		if (attempts > tries) {
			return {
				error: [
					`Hedera Mirrornode Overloaded after ${tries} attempts, unable to process query`
				]
			}
		}

		console.warn(
			`mirrornode overloaded, retrying in ${MIRRORNODE_WAIT_MS} ms, current attempt ${attempts} of ${tries} tries`
		)
		await sleep(MIRRORNODE_WAIT_MS)

		return retryableMirrorQuery(query, tries, ++attempts)
	}
}

/**
 * The primary purpose of this method is to detect whether the Treasury connects
 * the API has a given NFT for a serial number, however the expected account to
 * check against can be changed.
 *
 * @param nft_id
 * @param serial
 * @param expected
 * @returns {Promise<boolean>}
 */
async function checkTreasuryHasNft(
	nft_id,
	serial,
	expected = Config.accountId
) {
	const result = await retryableMirrorQuery(
		queryNftAccountOwner(nft_id, serial)
	)

	if (result?.error) {
		return result
	}

	return result.data.account_id === expected
}

/**
 * The primary purpose of this method is to detect whether the Treasury has enough
 * tokens in treasury to satisfy the batch transfer of NFTs
 *
 * @param nft_id
 * @param amount
 * @param expected
 * @returns {Promise<boolean>}
 */
async function checkTreasuryHasNftAmount(
	nft_id,
	amount,
	expected = Config.accountId
) {
	const result = await retryableMirrorQuery(
		queryTreasuryTokenBalance(nft_id, expected)
	)

	const { balances } = result.data

	if (!balances.length) {
		return false
	}

	return balances[0].balance >= amount
}

/**
 * Fetch the nft ids for a particular NFT tx, include the "next" id
 *
 * @param nft_id
 * @param limit
 * @param expected
 * @param link
 * @returns {Promise<boolean>}
 */
async function fetchNftIdsForBatchTransfer(
	nft_id,
	limit,
	link,
	expected = Config.accountId
) {
	const result = await retryableMirrorQuery(
		link ? queryReq(link) : getNftByLimit(nft_id, expected, limit)
	)

	const { nfts, links } = result.data

	const serials = nfts.splice(0, limit)

	return {
		actual: serials.length,
		serials: serials.map(nft => nft.serial_number),
		link: links.next
	}
}

/**
 * Check if a given account ID has ownership of an NFT, returned is the list of serial numbers of the
 * NFT they own, as well as a reference to links for whale owners 🐳
 *
 * The context here is we can prove if a given account has ownership of a special "NFT pass", and we can
 * map their specific serial to pre-minted NFTs (of atleast the same supply) relating to a project.
 *
 * @param nft_id
 * @param account_id
 */
async function getSerialNumbersOfOwnedNft(nft_id, account_id) {
	const result = await retryableMirrorQuery(
		queryNftForOwner(nft_id, account_id)
	)

	if (result?.error) {
		return result
	}

	const serial_numbers = result.data.nfts.map(nft => nft.serial_number)

	return {
		serial_numbers,
		owns_nfts: !!serial_numbers.length,
		has_multiple_nfts: serial_numbers.length > 1, // We will be using this logic in other parts of the app.
		links: result.data.links
	}
}

async function fetchTokenInformation(token_id) {
	const result = await retryableMirrorQuery(queryTokenInfo(token_id))

	if (result?.error) {
		return result
	}

	return result.data
}

/**
 * Ensure that an NFT with a given serial number is mintable and the max_supply is
 * equal to the parent projects "NFT pass"
 *
 * There are some outcomes from this:
 *
 * - If an NFT has a maximum supply different the expected it will rejected
 * - If an NFT's total supply does not match the maximum supply it is in a "pre-mint" phase
 *
 * @param token_id
 * @param maximum_parent_supply
 */
async function ensureClaimableChildNftIsTransferable(
	token_id,
	maximum_parent_supply
) {
	const token = await fetchTokenInformation(token_id)

	if (token?.error) {
		return token
	}

	const supply = Number.parseInt(token.max_supply)
	const hasExpectedSupply = supply === maximum_parent_supply
	const hasMintedSupply = supply === Number.parseInt(token.total_supply)
	const isTreasuryValid = token.treasury_account_id === Config.accountId

	return {
		token_id,
		hasExpectedSupply,
		hasMintedSupply,
		isTreasuryValid
	}
}

export default {
	checkTreasuryHasNft,
	getSerialNumbersOfOwnedNft,
	fetchTokenInformation,
	ensureClaimableChildNftIsTransferable,
	checkTreasuryHasNftAmount,
	fetchNftIdsForBatchTransfer
}
