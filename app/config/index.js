"use strict"

const {
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY,
	HIDE_STATUS
} = process.env

const AUTH_KEY_MIN_LENGTH = 10
const authenticationKeyValid = () =>
	API_SECRET_KEY && API_SECRET_KEY.length >= AUTH_KEY_MIN_LENGTH

export default {
	authenticationKeyValid,
	accountId: HEDERA_ACCOUNT_ID,
	privateKey: HEDERA_PRIVATE_KEY,
	authenticationKey: API_SECRET_KEY,
	hideStatus: HIDE_STATUS
}
