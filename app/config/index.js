"use strict"

import Environment from "app/constants/environment"

const {
	HEDERA_NETWORK,
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY,
	API_URL,
	HIDE_STATUS,
	WEBHOOK_URL,
	ENCRYPTION_KEY,
	NFT_STORAGE_TOKEN,
	MIRROR_NODE_URL
} = process.env

const { MAINNET } = Environment

// Note: This is the account treasury of Trust Enterprises that takes a 1/10th of royalty value.
// You may remove this logic entirely, but you're using this software to make your life easier for managing NFTs..
const ROYALTY_FEE_TREASURY =
	HEDERA_NETWORK.toLowerCase() === MAINNET ? "0.0.1119570" : "0.0.34319163"

const ROYALTY_FEE_FIVE_PERCENT_DIVISIBLE = 20

const AUTH_KEY_MIN_LENGTH = 10

const authenticationKeyValid = () =>
	API_SECRET_KEY && API_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH

export default {
	authenticationKeyValid,
	network: HEDERA_NETWORK.toLowerCase(),
	accountId: HEDERA_ACCOUNT_ID,
	privateKey: HEDERA_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	encryptionKey: ENCRYPTION_KEY,
	apiUrl: API_URL,
	hideStatus: HIDE_STATUS,
	webhookUrl: WEBHOOK_URL,
	nftStorageToken: NFT_STORAGE_TOKEN,
	mirrornodeUrl: MIRROR_NODE_URL,
	royaltyFeeTreasury: ROYALTY_FEE_TREASURY,
	royaltyFeeDivisor: ROYALTY_FEE_FIVE_PERCENT_DIVISIBLE
}
