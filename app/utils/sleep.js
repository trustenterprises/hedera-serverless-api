/*
 * Sleep to wait for hedera's mirror nodes to catch up.
 */

const DEFAULT_MS = 5000

function sleep (ms = DEFAULT_MS) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default sleep
