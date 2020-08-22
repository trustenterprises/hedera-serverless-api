import Config from "app/config"

const { HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, API_SECRET_KEY } = process.env

test("Make sure that the config returns the account id", () => {
	expect(Config.accountId).toBe(HEDERA_ACCOUNT_ID)
})

test("Make sure that the config returns the private key", () => {
	expect(Config.privateKey).toBe(HEDERA_PRIVATE_KEY)
})

test("Make sure that the config returns the api secret key", () => {
	expect(Config.authenticationKey).toBe(API_SECRET_KEY)
})
