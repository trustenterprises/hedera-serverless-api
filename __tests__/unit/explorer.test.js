import Explorer from "app/utils/explorer"
import Config from "app/config"

const placeholderTx = 'test'

test("Ensure that a testnet explorer url returns", () => {
  Config.HEDERA_NETWORK = 'testnet'

  const url = Explorer.getExplorerUrl(placeholderTx)

	expect(url).toBe(`https://ledger-testnet.hashlog.io/tx/${placeholderTx}`)
})

test("Ensure that a mainnet explorer url returns", () => {
  Config.HEDERA_NETWORK = 'mainnet'

  const url = Explorer.getExplorerUrl(placeholderTx)

  expect(url).toBe(`https://ledger.hashlog.io/tx/${placeholderTx}`)
})

test("Ensure that a previewnet explorer url returns nothing", () => {
  Config.HEDERA_NETWORK = 'previewnet'

  const url = Explorer.getExplorerUrl(placeholderTx)

	expect(!url)
})
