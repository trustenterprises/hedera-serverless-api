import Config from "app/config"
import Environment from "app/constants/environment"

const { MAINNET } = Environment

const ROYALTY_FEE_TREASURY =
	Config.network === MAINNET ? "0.0.1119570" : "0.0.34319163"

test("Expect that the Trust Enterprises fee account matches expected value", () => {
	expect(Config.royaltyFeeTreasury).toBe(ROYALTY_FEE_TREASURY)
})

test("Expect that the Trust Enterprises fee divisor is 5% (divisible by 20)", () => {
	expect(Config.royaltyFeeDivisor).toBe(20)
})
