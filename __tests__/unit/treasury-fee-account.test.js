import Config from "app/config"

test("Expect that the Trust Enterprises fee account matches expected value", () => {
	expect(Config.royaltyFeeTreasury).toBe('0.0.1119570')
})
