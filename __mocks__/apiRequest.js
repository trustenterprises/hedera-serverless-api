// Mocked request for setting headers

const mockedApiRequest = ({
  mock: (
    headers = {},
    method = "GET"
  ) => ({
    headers,
    method
  })
})

export default mockedApiRequest
