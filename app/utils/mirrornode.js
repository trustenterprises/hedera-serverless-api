import Config from "app/config"
import axios from "axios"

const mirrornode = Config.mirrornodeUrl;
const queryNftAccountOwner = (token_id, serial) => `${mirrornode}/api/v1/tokens/${token_id}/nfts/${serial}`

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
	const query = queryNftAccountOwner(token_id, serial)
	const result = await axios.get(query)

	return result.data.account_id === expected;
}

export default {
	checkTreasuryHasNft
}
