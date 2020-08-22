// App imports
import Config from "app/config"
import Language from "app/constants/language"
import onlyGet from "app/middleware/onlyGet"

// Mocks
import MockedApiResponse from "mocks/apiResponse"
import MockedApiRequest from "mocks/apiRequest"

const { onlyPostResponse } = Language.middleware

const mockedHandler = () => 'ok'
const handlerWithMiddleware = onlyGet(mockedHandler)
const mockedApiResponse = MockedApiResponse.mock()

test("Expect that a request with a GET method succeeds", async () => {
	const mockedApiRequest = MockedApiRequest.mock()
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response).toBe("ok")
})

test("Expect that a request with a POST method fails", async () => {
	const mockedApiRequest = MockedApiRequest.mock({}, "POST")
	const response = await handlerWithMiddleware(mockedApiRequest, mockedApiResponse)

	expect(response.reason).toBe(onlyPostResponse.notAllowed("POST"))
})
