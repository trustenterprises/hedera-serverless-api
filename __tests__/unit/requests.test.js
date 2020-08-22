import Request from "app/constants/request"

test("Request type is GET", () => {
	expect(Request.GET).toBe("GET")
})

test("Request type is POST", () => {
	expect(Request.POST).toBe("POST")
})

test("Request type is PUT", () => {
	expect(Request.PUT).toBe("PUT")
})

test("Request type is DELETE", () => {
	expect(Request.DELETE).toBe("DELETE")
})
