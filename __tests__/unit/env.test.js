const {
	HEDERA_NETWORK,
	HEDERA_ACCOUNT_ID,
	HEDERA_PRIVATE_KEY,
	API_SECRET_KEY
} = process.env

test("Make sure that hedera account id exists", () => {
	expect(HEDERA_ACCOUNT_ID.length)
})

test("Make sure that hedera network exists", () => {
	expect(HEDERA_NETWORK.length)
})

test("Make sure that hedera account id matches format", () => {
	const sections = HEDERA_ACCOUNT_ID.split(".")

	expect(sections.length).toBe(3)
})

test("Make sure that hedera account id is comprised of numbers", () => {
	const sections = HEDERA_ACCOUNT_ID.split(".")

	sections.forEach(section => {
		expect(Number.isInteger(parseInt(section))).toBe(true)
	})
})

test("Make sure that hedera private keys exists", () => {
	expect(HEDERA_PRIVATE_KEY.length)
})

test("Make sure that a secret Auth key exists", () => {
	expect(API_SECRET_KEY.length)
})
