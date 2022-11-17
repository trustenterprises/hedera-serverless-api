const BATCH_LIMITS = {
	nftTransfers: 10
}

/**
 * Create an array of cycles of NFT transfers based on an amount and a max limit.
 *
 * @param amount
 * @returns {any[]}
 */
function nftTransfer(amount) {
	// mod rem diff
	const rem = amount % BATCH_LIMITS.nftTransfers

	// Basal cycle for batch, as a whole number
	const max = (amount - rem) / BATCH_LIMITS.nftTransfers

	// When rem is falsely, remove -- more simple then if
	const cycle = Array(max)
		.fill(BATCH_LIMITS.nftTransfers)
		.concat(rem)
		.filter(e => e)

	// For readability
	return cycle
}

export default {
	nftTransfer
}
