module.exports = {
	// middleware language for requests
  middleware: {
    withAuthenticationResponse: {
      noApikey: 'Please set "x-api-key" in your header',
    	invalidApikey: 'Unable to validate with the supplied "x-api-key"'
    }
  },

}
