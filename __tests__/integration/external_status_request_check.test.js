import Config from "app/config"
import Language from "app/constants/language"
import axios from "axios"

const { apiUrl, hideStatus } = Config

test("Check 'API_URL' does not end in a '/'", async () => {
  if (!apiUrl) {
    console.warn("Skipping test as 'API_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  const lastchar = apiUrl.substr(apiUrl.length - 1)

  expect(lastchar).not.toBe("/")
})

test("Check external '/api/status' returns a valid response, is it ready to be used?", async () => {

  if (!apiUrl) {
    console.warn("Skipping test as 'API_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  const { data } = await axios.get(`${apiUrl}/api/status`)

  if (hideStatus) {
    expect(data).toBe("ok")
    return
  }

  const { message, environment_status, meta } = data

  // basic strings
  expect(message).toBe(Language.statusRequest.message)
  expect(meta.hint).toBe(Language.statusRequest.meta_hint)

  // Status
  expect(environment_status.hederaAccountId).toBe(true)
  expect(environment_status.hederaPrivateKey).toBe(true)
  expect(environment_status.authenticationKey).toBe(true)
})

test("Check external '/api/account/balance' returns a valid response, is it ready to be used?", async () => {

  if (!apiUrl) {
    console.warn("Skipping test as 'API_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  const { data } = await axios.get(`${apiUrl}/api/account/balance`, {
    headers: {
      'x-api-key': Config.authenticationKey
    }
  })

  expect(data.balance).not.toBe(null)
})
