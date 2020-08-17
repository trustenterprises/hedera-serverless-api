// Mocked request for setting headers

const mockedApiRequest = ({
  mock: (
    headers = {}
  ) => ({
    headers
  })
})

export default mockedApiRequest
