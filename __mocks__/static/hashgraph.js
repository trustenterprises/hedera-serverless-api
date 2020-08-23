
// New topic & options
const newTopic = {
  topic: '0.0.127561'
}

const newTopicWithPublicKey = {
  ...newTopic,
  submitPublicKey: "302a300506032b657003210034314146f2f694822547af9007baa32fcc5a6962e7c5141333846a6cf04b64ca"
}

const newTopicWithMemo = {
  ...newTopic,
  memo: "hello"
}

const newTopicWithMemoAndKey = {
  ...newTopicWithMemo,
  ...newTopicWithPublicKey
}

const accountBalance = {
  balance: "9995.232"
}

const showTopic = {
  topicMemo: "test",
  adminKey: null,
  submitKey: null,
  autoRenewAccount: null
}

export default {
  showTopic,
  newTopic,
  newTopicWithPublicKey,
  newTopicWithMemo,
  newTopicWithMemoAndKey,
  accountBalance
}
