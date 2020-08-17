"use strict"

const {
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY,
	HIDE_STATUS
} = process.env

export default {
	accountId: HEDERA_ACCOUNT_ID,
	privateKey: HEDERA_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	hideStatus: HIDE_STATUS
}
