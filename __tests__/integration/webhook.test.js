import Status from "app/constants/status"
import Config from "app/config"
import axios from "axios"

const { webhookUrl } = Config

test("Check external '/api/status' returns a valid response, is it ready to be used?", async () => {

  if (!webhookUrl) {
    console.warn("Skipping test as 'WEBHOOK_URL' not found in environment, for these tests to pass your external service needs to be redeployed");
    return
  }

  const response = await axios.post(webhookUrl)

  expect(response.status).toBe(Status.OK)
})
