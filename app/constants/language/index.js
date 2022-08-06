module.exports = {
	// middleware language for requests
	middleware: {
		withAuthenticationResponse: {
			noApikey: 'Please set "x-api-key" in your header',
			invalidApikey: 'Unable to validate with the supplied "x-api-key"'
		},
		mirrornode: {
			notSet: 'Please set a reference to a mirrornode by setting "MIRROR_NODE_URL" in your environment'
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
			description: 'Hedera HIP412 "Strict" validation for generating valid network metadata',
			url: 'https://hips.hedera.com/hip/hip-412'
		}
	},

	// Requests
	statusRequest: {
		message: "Your environment status for your client",
		meta_hint:
			'Hide this status endpoint by setting "HIDE_STATUS=TRUE" in your environment'
	}
}
