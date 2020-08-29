import Status from "app/constants/status"

test("UNAUTHORIZED status code is 401", () => {
	expect(Status.UNAUTHORIZED).toBe(401)
})

test("OK status code is 200", () => {
	expect(Status.OK).toBe(200)
})

test("UNPROCESSIBLE_ENTITY status code is 422", () => {
	expect(Status.UNPROCESSIBLE_ENTITY).toBe(422)
})

test("BAD_REQUEST status code is 400", () => {
	expect(Status.BAD_REQUEST).toBe(400)
})

test("METHOD_NOT_ALLOWED status code is 405", () => {
	expect(Status.METHOD_NOT_ALLOWED).toBe(405)
})
