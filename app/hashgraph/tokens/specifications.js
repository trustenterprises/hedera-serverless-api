/**
 * Update the type definition of Specification when new bits are required
 */
// export type Specification = {
//   reference: string;
//   decimals: number;
//   kyc: boolean;
//   wipe: boolean;
//   freeze: boolean;
// }

/**
 * TODO: more conversations and design about interop and bridging required to reduce precision loss
 *
 * This is a prototype spec that describes the interop for trading
 * imported ERC20 tokens with minted HTS tokens. This provides a
 * common shared attributes, the decimal places have been reduced to
 * 6 as we wish to have enough precision but not lose the max limit
 * for (2 - 1) * (10 ** 64)
 *
 * As at 01/02/21 provides a precision loss of 1.3 cents for 0.000001 eth
 *
 * With 6 digits of precision we have have a max HTS limit of for this spec
 *
 * 9,223,372,036,854.775 (9 trillion)
 *
 * @type {{decimals: number}}
 */
const Fungible = {
	reference: "basic.fungible",
	decimals: 6,
	kyc: false,
	wipe: false,
	freeze: false
}

/**
 * When creating NFT representations of tokens we require a token to be unique
 * and non fungible, it cannot be divided.
 *
 * @type {{decimals: number}}
 */
const NonFungible = {
	reference: "basic.nonfungible",
	decimals: 0,
	kyc: false,
	wipe: false,
	freeze: false
}

/**
 * A KYC, freeze and wipe compliant fungible token, based on ERC20 that enables a token that has more control
 * for regulatory and stricter requirements for investment purposes.
 *
 * @type {{decimals: number}}
 */
const CompliantFungible = {
	...Fungible,
	reference: "compliance.fungible",
	kyc: true,
	wipe: true,
	freeze: true
}

/**
 * A KYC, freeze and wipe compliant fungible token, based on ERC721/Non fungible that enables a token
 * that has more control for regulatory and stricter use cases.
 *
 * @type {{decimals: number}}
 */
const CompliantNonFungible = {
	...NonFungible,
	reference: "compliance.nonfungible",
	kyc: true,
	wipe: true,
	freeze: true
}

/**
 * A special token that acts as a receipt for deposited assets in a pool. These
 * can be returned to the treasury account that minted them. Upon receipt a claimant
 * will be returned all tokens deposited and their fair share of the reward distribution.
 *
 * @type {{decimals: number}}
 */
const UnibarLiquidityProviderReceipt = {
	...NonFungible,
	reference: "lp.reward.receipt"
}

export default {
	Fungible,
	NonFungible,
	CompliantFungible,
	CompliantNonFungible,
	UnibarLiquidityProviderReceipt
}
