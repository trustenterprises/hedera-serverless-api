import consensusMessageRequest from "app/validators/consensusMessageRequest"

test("Check that validation succeeds for no object", () => {
	const validation = consensusMessageRequest()

	expect(!!validation).toBe(true)
})

test("Check that validation fails for message", () => {
	const validation = consensusMessageRequest({ message: 1, allow_synchronous_consensus: "12" })

	expect(validation[0]).toBe('"message" must be a string')
})

test("Check that validation fails for required 'topic_id'", () => {
	const validation = consensusMessageRequest({ message: "This is recorded", allow_synchronous_consensus: "12" })

	expect(validation[0]).toBe('\"topic_id\" is required')
})

test("Check that validation fails for incorrect boolean 'allow_synchronous_consensus'", () => {
	const validation = consensusMessageRequest({ message: "This is recorded", topic_id: '123', allow_synchronous_consensus: "12" })

	expect(validation[0]).toBe('\"allow_synchronous_consensus\" must be a boolean')
})

test("Check that validation fails for reference", () => {
	const validation = consensusMessageRequest({ message: "This is recorded", topic_id: '123', reference: 1 })

	expect(validation[0]).toBe('"reference" must be a string')
})

test("Validation works for basic requirements", () => {
	const validation = consensusMessageRequest({ message: "This is recorded", topic_id: '123' })

	expect(!!validation).toBe(false)
})
