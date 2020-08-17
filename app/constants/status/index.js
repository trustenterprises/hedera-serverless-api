module.exports = {
	// Default success
	OK: 200,

	// Status used when an invalid authentication key is used
	UNAUTHORIZED: 401,

	// Focused on validation, if a check fails this is used
	UNPROCESSIBLE_ENTITY: 422,

	// Generic catch-all bad request, unless the server throws a 500
	BAD_REQUEST: 400
}
