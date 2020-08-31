import Status from "app/constants/status"
import Config from "app/config"
import Hmac from "app/utils/hmac"
import MockHashgraphResponse from 'mocks/static/hashgraph'
import axios from "axios"

const { webhookUrl } = Config

test("Check webhook cannot consumed with a GET request", async () => {

  if (!webhookUrl) {
    console.warn("Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  await expect(axios.get(webhookUrl)).rejects.toThrow("Request failed with status code 405");
})

test("Check webhook has been hit, if a signature does not exist, return 400", async () => {

  if (!webhookUrl) {
    console.warn("Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  await expect(axios.post(webhookUrl)).rejects.toThrow("Request failed with status code 400");
})

test("Check webhook has been hit, with a bad signature", async () => {

  if (!webhookUrl) {
    console.warn("Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  await expect(
    axios.post(webhookUrl, {}, {
      headers: {
        'x-signature': '123'
      }
    })
  ).rejects.toThrow("Request failed with status code 400");
})

test("Check webhook has been hit, with a good signature and body", async () => {

  if (!webhookUrl) {
    console.warn("Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  const { consensusMessageResponse } = MockHashgraphResponse
  const mockResponseAsString = JSON.stringify(consensusMessageResponse)
  const config = {
    headers: {
      'x-signature': Hmac.generateHash(mockResponseAsString)
    }
  }

  const response = await axios.post(webhookUrl, consensusMessageResponse, config)

  await expect(response.status).toBe(Status.OK);
})
