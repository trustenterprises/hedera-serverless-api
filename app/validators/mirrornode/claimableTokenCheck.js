import Mirror from "app/utils/mirrornode"
import Language from "app/constants/language"

/**
 * Breaking down step one: That an account holds ownership of a parent "NFT pass"
 */
const ensureAccountHoldsPassSerial = async (
	receiver_id,
	nft_pass_token_id,
	serialNumbers
) => {
	const nftHoldings = await Mirror.getSerialNumbersOfOwnedNft(
		nft_pass_token_id,
		receiver_id
	)

	// Catch all for timeouts
	if (nftHoldings?.error) {
		return nftHoldings
	}

	const {
		doesNotOwnNftPass,
		ownsMultipleNftPasses
	} = Language.hashgraphClient.claimNft

	// Firstly, infer that an account has an NFT pass
	if (!nftHoldings.owns_nfts) {
		return { error: doesNotOwnNftPass }
	}

	// Second, check that if a child NFT hasn't been selected, reject those with multiple passes
	if (!serialNumbers && nftHoldings.has_multiple_nfts) {
		return { error: ownsMultipleNftPasses }
	}

	return nftHoldings.serial_numbers
}

/**
 * Breaking down step two: That an account holds ownership of a pass of a particular serial.
 */
const confirmAccountHoldsActualSerial = async (
	pass_id,
	serial_number,
	receiver_id
) => {
	const hasNftSerial = await Mirror.checkTreasuryHasNft(
		pass_id,
		serial_number,
		receiver_id
	)

	// Catch all for timeouts
	if (hasNftSerial?.error) {
		return hasNftSerial
	}

	if (!hasNftSerial) {
		return {
			error: Language.hashgraphClient.claimNft.doesNotOwnSerial(serial_number)
		}
	}

	return true
}

const confirmChildTokenIsTransferable = async (
	token_id,
	maximum_parent_supply
) => {
	const childTokenState = await Mirror.ensureClaimableChildNftIsTransferable(
		token_id,
		maximum_parent_supply
	)

	// Catch all for timeouts
	if (childTokenState?.error) {
		return childTokenState
	}

	if (!childTokenState.isTreasuryValid) {
		return {
			error: Language.hashgraphClient.claimNft.tokenTreasuryInvalid
		}
	}

	if (!childTokenState.hasExpectedSupply) {
		return {
			error: Language.hashgraphClient.claimNft.tokenSupplyDoesNotMatch
		}
	}

	if (!childTokenState.hasMintedSupply) {
		return {
			error: Language.hashgraphClient.claimNft.tokenHasNotBeenPreminted
		}
	}

	return true
}

/**
 * Breaking down step two: That an account holds ownership of a pass of a particular serial.
 */
const confirmTreasuryHoldsChild = async (token_id, serial_number) => {
	const hasNftSerial = await Mirror.checkTreasuryHasNft(token_id, serial_number)

	// Catch all for timeouts
	if (hasNftSerial?.error) {
		return hasNftSerial
	}

	if (!hasNftSerial) {
		return {
			error: Language.hashgraphClient.claimNft.treasuryDoesNotHold(
				serial_number
			)
		}
	}

	return true
}

/**
 * Given an account that wishes to claim a child NFT for a given project, which is derived from the
 * Ownership of a specific parents NFT pass serial such as "Inky's art club", allow the account to claim a child NFT.
 *
 * We want to ensure the steps:
 *
 * 0. That an account holds ownership of a parent "NFT pass"
 * 1. That a given child NFT Is transferable, or has been fully "pre-minted"
 * 2. That the Treasury has current ownership of an asset
 * 3. Attempt a transfer of child NFT to the account
 *
 */
async function claimableTokenCheck({
	token_id,
	receiver_id,
	nft_pass_token_id,
	serial_number
}) {
	// Validate user owns NFT
	const serialNumbers = await ensureAccountHoldsPassSerial(
		receiver_id,
		nft_pass_token_id,
		serial_number
	)

	if (serialNumbers?.error) {
		return serialNumbers
	}

	// Grab the inputed serial or pulled from mirrornode
	const candidate_serial_number = serial_number || serialNumbers[0]

	// Confirm that the account holds the expected serial, could be considered overkill
	const hasAccountHoldSerial = await confirmAccountHoldsActualSerial(
		nft_pass_token_id,
		candidate_serial_number,
		receiver_id
	)

	if (hasAccountHoldSerial?.error) {
		return hasAccountHoldSerial
	}

	const tokenPassInfo = await Mirror.fetchTokenInformation(nft_pass_token_id)

	if (tokenPassInfo?.error) {
		return tokenPassInfo
	}

	// Get max supply of pass via mirrornode
	const nftPassSupply = Number.parseInt(tokenPassInfo.total_supply)

	// Ensure that the claimable child token is in a claimable state
	const isTokenTransferable = await confirmChildTokenIsTransferable(
		token_id,
		nftPassSupply
	)

	if (isTokenTransferable?.error) {
		return isTokenTransferable
	}

	// Finally check that the treasury holds the expected child token_id
	const ensureChildIsInTreasury = await confirmTreasuryHoldsChild(
		token_id,
		serial_number
	)

	if (ensureChildIsInTreasury?.error) {
		return ensureChildIsInTreasury
	}

	return {
		token_id,
		receiver_id,
		serial_number: candidate_serial_number
	}
}

export default claimableTokenCheck
