import createTopicRequest from "app/validators/createTopicRequest"

test("Check that validation succeeds for no object", () => {
	const validation = createTopicRequest()

	expect(!!validation).toBe(false)
})

test("Check that validation fails for memo", () => {
	const validation = createTopicRequest({ memo: 1, enable_private_submit_key: "12" })

	expect(validation[0]).toBe('"memo" must be a string')
})

test("Check that validation fails for incorrect boolean 'enable_private_submit_key'", () => {
	const validation = createTopicRequest({ enable_private_submit_key: "12" })

	expect(validation[0]).toBe('\"enable_private_submit_key\" must be a boolean')
})
