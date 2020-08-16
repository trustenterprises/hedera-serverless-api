import Config from "../../app/config"

const { HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY } = process.env

test("Make sure that the config returns an object of env", () => {
	expect(Config.accountId).toBe(HEDERA_ACCOUNT_ID)
	expect(Config.privateKey).toBe(HEDERA_PRIVATE_KEY)
})
