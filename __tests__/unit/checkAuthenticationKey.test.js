import Config from "app/config"
import Validation from "app/validators"

test("Ensure that the authentication key is valid", () => {
	const isValidKey = Validation.checkAuthenticationKey(Config.authenticationKey)

	expect(isValidKey).toBe(true)
})

test("Ensure that a bad authentication key is invalid", () => {
	const isValidKey = Validation.checkAuthenticationKey("1234")

	expect(isValidKey).toBe(false)
})
