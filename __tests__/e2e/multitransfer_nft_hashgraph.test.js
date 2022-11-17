import HashgraphClient from "app/hashgraph/client"

const client = new HashgraphClient()

// NFT is reused for different tests
let nft

// Account of dummy user claiming NFTs from treasury
let dummyAccount

// Reused please
const TOKENS_SUPPLY = 200

// Utility for sending batch.
const sendBatch = async amount => {
	if (!dummyAccount || !nft) {
		throw Error('NFT or account state not initialised.')
	}

	return await client.multipleNftTransfer({
		token_id: nft.token_id,
		receiver_id: dummyAccount.accountId,
		serials: Array(amount).fill(1).map((e, i) => i + e)
	})
}

const sendBatchUsingMirrornode = async (amount = 30) => {
	if (!dummyAccount || !nft) {
		throw Error('NFT or account state not initialised.')
	}

	return await client.batchTransferNft({
		token_id: nft.token_id,
		// token_id: '0.0.48905114',
		receiver_id: dummyAccount.accountId,
		amount
	})

}

const mintMoarNfts = async (amount = 10) => {
	const mintNfts = {
		amount,
		token_id: nft.token_id,
		cid: 'xxx'
	}

	return await client.mintNonFungibleToken(mintNfts)
}

// This will be generated uniquely per NFT (low-priority test)

test("This test will create an NFT and mint all tokens", async () => {

	const passTokenData = {
		supply: TOKENS_SUPPLY,
		collection_name: 'example nft',
		symbol: 'te-e2e-nft'
	}

	nft = await client.createNonFungibleToken(passTokenData)

	const mint = await mintMoarNfts(5)

	expect(mint.token_id).toBe(nft.token_id)

	console.log(mint)

}, 30000)

// Normally this would hit an end point for an integration test
test("This will create an account and attempt to send a multiple transfer to account", async () => {

	dummyAccount = await client.createAccount()

	// This should fail as we have only minted 5
	const badSend = await sendBatch(6)

	expect(badSend.total).toBe(0)
	expect(badSend.error).toBeTruthy()

	const goodSend = await sendBatch(5)

	expect(goodSend.total).toBe(5)
	expect(goodSend.error).toBeFalsy()

}, 20000)


test("Send a big'ol batch of NFTs!", async () => {

	const send = await sendBatchUsingMirrornode()

	expect(send.error[0]).toBe(`The treasury does not hold the amount of NFTs of id ${nft.token_id} to do the required batch transfer`)

	// Due to mirrornode limitations we can't test this in real time
	// await mintMoarNfts()
	// await mintMoarNfts()
	// await mintMoarNfts()
	// await mintMoarNfts()
	// await mintMoarNfts()
	// await mintMoarNfts()
	// await mintMoarNfts()
	//
	// const sendMoar = await sendBatchUsingMirrornode(38)
	//
	// console.log(sendMoar)
	// expect(sendMoar.results.length).toBeTruthy()

}, 20000)
