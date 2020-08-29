module.exports = {
	// Default success
	OK: 200,

	// Generic catch-all bad request, unless the server throws a 500
	BAD_REQUEST: 400,

	// Status used when an invalid authentication key is used
	UNAUTHORIZED: 401,

	// Catch requests to valid endpoints not using a valid method
	METHOD_NOT_ALLOWED: 405,

	// Focused on validation, if a check fails this is used
	UNPROCESSIBLE_ENTITY: 422
}
