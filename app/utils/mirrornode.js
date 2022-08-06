import Config from "app/config"
import axios from "axios"
import sleep from "app/utils/sleep"

const mirrornode = Config.mirrornodeUrl;
const queryNftAccountOwner = (token_id, serial) => `${mirrornode}/api/v1/tokens/${token_id}/nfts/${serial}`

const MIRRORNODE_WAIT_MS = 500;
const MIRRORNODE_TRIES = 5;

const retryableMirrorQuery = async (query, tries = MIRRORNODE_TRIES, attempts = 1) => {
	try {
		return await axios.get(query)
	} catch (e) {
		if (attempts > tries) {
			return {
				error: `Hedera Mirrornode Overloaded after ${tries} attempts, unable to process query`
			}
		}

		console.warn(`mirrornode overloaded, retrying in ${MIRRORNODE_WAIT_MS} ms, current attempt ${attempts} of ${tries} tries`)
		await sleep(MIRRORNODE_WAIT_MS)

		return retryableMirrorQuery(query, tries, ++attempts)
	}
}

/**
 * The primary purpose of this method is to detect whether the Treasury connects
 * the API has a given NFT for a serial number, however the expected account to
 * check against can be changed.
 *
 * @param token_id
 * @param serial
 * @param expected
 * @returns {Promise<boolean>}
 */
async function checkTreasuryHasNft(token_id, serial, expected = Config.accountId) {
	const result = await retryableMirrorQuery(queryNftAccountOwner(token_id, serial))

	if (result?.error) {
		return result
	}

	return result.data.account_id === expected;
}

export default {
	checkTreasuryHasNft
}
