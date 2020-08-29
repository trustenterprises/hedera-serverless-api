import onlyPost from "app/middleware/onlyPost"
import prepare from "app/utils/prepare"
import ExampleWebhookHandler from "app/handler/exampleWebhookHandler"

export default prepare(onlyPost)(ExampleWebhookHandler)
