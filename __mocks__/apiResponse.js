// Mocked request handler for dealing with status and send

class mockedApiResponse {

  static mock () {
    return new mockedApiResponse()
  }

  status (status) {
    return this
  }

  send (body) {
    return body
  }
}

export default mockedApiResponse
