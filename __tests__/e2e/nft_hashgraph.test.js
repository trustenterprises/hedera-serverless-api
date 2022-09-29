import HashgraphClient from "app/hashgraph/client"
import sleep from "app/utils/sleep"
import Config from "app/config"
import Language from "app/constants/language"
import claimableTokenCheck from "app/validators/mirrornode/claimableTokenCheck"
import Encryption from "app/utils/encryption"

const client = new HashgraphClient()

// NFT PASS is reused for different tests
let nftPass

// NFT project is reused
let nftProject

// Account of dummy user claiming NFTs from treasury
let dummyAccount

// Reused please
const SERIAL_NUM = 1
const TOKENS_SUPPLY = 4

// This will be generated uniquely per NFT (low-priority test)
const CID = 'bafkreicbj2mpokehujztfqs35nnbqwe36t343lp6j2u6zbkul5q3ayoe7i'

test("This test will create an NFT pass and ensure that there is a proper response", async () => {

	const passTokenData = {
		supply: TOKENS_SUPPLY,
		collection_name: 'example pass',
		symbol: 'te-e2e-pass'
	}

	nftPass = await client.createNonFungibleToken(passTokenData)

	expect(nftPass.collection_name).toBe(passTokenData.collection_name)
	expect(nftPass.symbol).toBe(passTokenData.symbol)
	expect(nftPass.max_supply).toBe(passTokenData.supply)
	expect(nftPass.treasury_id).toBe(Config.accountId)
	expect(nftPass.token_id).toBeDefined()
	expect(nftPass.collection_considered_unsafe).toBeFalsy()

}, 20000)

test("This test will create an NFT project and ensure that there is a proper response", async () => {

	const projectTokenData = {
		supply: TOKENS_SUPPLY,
		collection_name: 'example project',
		symbol: 'te-e2e-project'
	}

	nftProject = await client.createNonFungibleToken(projectTokenData)

	expect(nftProject.collection_name).toBe(projectTokenData.collection_name)
	expect(nftProject.symbol).toBe(projectTokenData.symbol)
	expect(nftProject.max_supply).toBe(projectTokenData.supply)
	expect(nftProject.treasury_id).toBe(Config.accountId)
	expect(nftProject.token_id).toBeDefined()
	expect(nftProject.collection_considered_unsafe).toBeFalsy()

}, 20000)

test("This test will mint tokens for the NFT pass", async () => {

	const mintPassTokens = {
		token_id: nftPass.token_id,
		amount: TOKENS_SUPPLY,
		cid: CID
	}

	const mint = await client.mintNonFungibleToken(mintPassTokens)

	expect(mint.amount).toBe(TOKENS_SUPPLY)
	expect(mint.token_id).toBe(nftPass.token_id)

}, 20000)

test("This test will mint tokens for the NFT project", async () => {

	const mintProjectTokens = {
		token_id: nftProject.token_id,
		amount: TOKENS_SUPPLY,
		cid: CID
	}

	const mint = await client.mintNonFungibleToken(mintProjectTokens)

	expect(mint.amount).toBe(TOKENS_SUPPLY)
	expect(mint.token_id).toBe(nftProject.token_id)

}, 20000)

// Normally this would hit an end point for an integration test
test("This will create an account and attempt to claim a token this will fail due to lack of association", async () => {

	dummyAccount = await client.createAccount({
		hasAutomaticAssociations: false
	})

	const claimable = await claimableTokenCheck({
		token_id: nftProject.token_id,
		receiver_id: dummyAccount.accountId,
		nft_pass_token_id: nftPass.token_id,
		serial_number: SERIAL_NUM,
	})

	expect(claimable.error).toBe(Language.hashgraphClient.claimNft.doesNotOwnNftPass)

}, 20000)

test("An account will associate and get the pass transferred to them", async () => {

	const privateKey = await Encryption.decrypt(dummyAccount.encryptedKey)

	await client.associateToAccount({
		privateKey,
		tokenIds: [ nftPass.token_id ],
		accountId: dummyAccount.accountId
	})

	await client.transferNft({
		token_id: nftPass.token_id,
		receiver_id: dummyAccount.accountId,
		serial_number: SERIAL_NUM
	})

	// Waiting for mirrornode
	await sleep(10000)

	const claimable = await claimableTokenCheck({
		token_id: nftProject.token_id,
		receiver_id: dummyAccount.accountId,
		nft_pass_token_id: nftPass.token_id,
		serial_number: SERIAL_NUM,
	})

	expect(claimable.receiver_id).toBe(dummyAccount.accountId)
	expect(claimable.serial_number).toBe(SERIAL_NUM)
	expect(claimable.token_id).toBe(nftProject.token_id)

}, 20000)

test("After pass has been transferred a the same pass will be attempted to be sent", async () => {

	const transfer = await client.transferNft({
		token_id: nftPass.token_id,
		receiver_id: dummyAccount.accountId,
		serial_number: SERIAL_NUM
	})

	expect(transfer.error[0]).toBe(`The treasury does not hold the token ${nftPass.token_id} of serial ${SERIAL_NUM}`)
}, 20000)


test("After pass has been transferred a claim will be attempted again", async () => {

	const transfer = await client.transferNft({
		token_id: nftProject.token_id,
		receiver_id: dummyAccount.accountId,
		serial_number: SERIAL_NUM
	})

	expect(transfer.token_id).toBe(nftProject.token_id)
	expect(transfer.error[0]).toBe('Transfer failed, ensure that the recipient account is valid and has associated to the token')
}, 20000)


test("Account assoc's to project NFT and claim tries again", async () => {
	const privateKey = await Encryption.decrypt(dummyAccount.encryptedKey)

	await client.associateToAccount({
		privateKey,
		tokenIds: [ nftProject.token_id ],
		accountId: dummyAccount.accountId
	})

	await client.transferNft({
		token_id: nftProject.token_id,
		receiver_id: dummyAccount.accountId,
		serial_number: SERIAL_NUM
	})

	// Waiting for mirrornode
	await sleep(10000)

	const claimable = await claimableTokenCheck({
		token_id: nftProject.token_id,
		receiver_id: dummyAccount.accountId,
		nft_pass_token_id: nftPass.token_id,
		serial_number: SERIAL_NUM,
	})

	expect(claimable.error).toBe('Unfortunately the treasury does not own the expected NFT of serial of 1')

}, 20000)
