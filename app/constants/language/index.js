module.exports = {
	// middleware language for requests
	middleware: {
		withAuthenticationResponse: {
			noApikey: 'Please set "x-api-key" in your header',
			invalidApikey: 'Unable to validate with the supplied "x-api-key"'
		}
	},

	// Requests
	statusRequest: {
		message: "Your environment status for your client",
		meta_hint: 'Hide this status endpoint by setting "HIDE_STATUS=TRUE" in your environment'
	}
}
