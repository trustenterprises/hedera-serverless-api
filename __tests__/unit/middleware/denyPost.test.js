// App imports
import Config from "app/config"
import Language from "app/constants/language"
import denyPost from "app/middleware/denyPost"

// Mocks
import MockedApiResponse from "mocks/apiResponse"
import MockedApiRequest from "mocks/apiRequest"

const { onlyPostResponse } = Language.middleware

const mockedHandler = () => 'ok'
const handlerWithMiddleware = denyPost(mockedHandler)
const mockedApiResponse = MockedApiResponse.mock()

test("Expect that a request with a POST method fails", async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, "POST")
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response.reason).toBe(onlyPostResponse.notAllowed("POST"))
})

test("Expect that a request with a GET method succeeds", async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, "GET")
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response).toBe('ok')
})

test("Expect that a request with a PUT method succeeds", async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, "PUT")
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response).toBe('ok')
})

test("Expect that a request with a DELETE method succeeds", async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, "DELETE")
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response).toBe('ok')
})
