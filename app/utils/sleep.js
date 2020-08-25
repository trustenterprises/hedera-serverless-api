/*
 * Sleep to wait for hedera's mirror nodes to catch up.
 */

// Maximum expected time for consensus finality.
const DEFAULT_MS = 5000

function sleep(ms = DEFAULT_MS) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export default sleep
