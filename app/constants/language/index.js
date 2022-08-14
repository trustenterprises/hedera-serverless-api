module.exports = {
	// middleware language for requests
	middleware: {
		withAuthenticationResponse: {
			noApikey: 'Please set "x-api-key" in your header',
			invalidApikey: 'Unable to validate with the supplied "x-api-key"'
		},
		mirrornode: {
			notSet:
				'Please set a reference to a mirrornode by setting "MIRROR_NODE_URL" in your environment'
		},
		ensureEncryptionKey: {
			noEncryptionKey:
				'Unable to process encryption action, 32 character length "ENCRYPTION_KEY" not set in config'
		},
		ensureNftStorageToken: {
			noKey:
				'Before creating metadata please create and set a "NFT_STORAGE_TOKEN" from "nft.storage"'
		},
		onlyPostResponse: {
			notAllowed: method => `Method ${method} is not allowed on this route`
		}
	},

	// Validation
	ensureNftStorageAvailable: {
		meta: {
			description:
				'Hedera HIP412 "Strict" validation for generating valid network metadata',
			url: "https://hips.hedera.com/hip/hip-412"
		}
	},

	// Requests
	statusRequest: {
		message: "Your environment status for your client",
		meta_hint:
			'Hide this status endpoint by setting "HIDE_STATUS=TRUE" in your environment'
	},

	// Hashgraph client related functions
	hashgraphClient: {
		claimNft: {
			treasuryDoesNotHold: serial =>
				`Unfortunately the treasury does not own the expected NFT of serial of ${serial}`,
			doesNotOwnSerial: serial =>
				`Unfortunately this account does not own the NFT pass serial of ${serial}`,
			tokenTreasuryInvalid:
				"The treasury account of the claimable token does not match the project",
			tokenSupplyDoesNotMatch:
				"The claimable token supply does not match the expected NFT pass",
			tokenHasNotBeenPreminted:
				"The claimable token has not been preminted yet",
			doesNotOwnNftPass:
				"Unfortunately this account does not own the NFT pass required",
			ownsMultipleNftPasses:
				'This account owns multiple NFT passes, explicitly set "nft_pass_token_id" in your request'
		}
	}
}
