
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

const updateTopic = {
  topicId: "0.0.134383",
  accountId: {
    shard: 0,
    realm: 0,
    account: 6616
  }
}

const updateTopicWithMemo = {
  ...updateTopic,
  topicId: "0.0.134383",
  memo: "hello"
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

const consensusMessageResponse = {
  reference: "test",
  topic_id: "0.0.134383",
  consensus_timestamp: {
    "seconds": 1598306688,
    "nanos": 750728007
  },
  transaction_id: "0.0.116507@1598338540.979000000"
}

const transactionMessageResponse = {
  data: {
    transactionId: "0.0.116507@1598338540.979000000"
  }
}

export default {
  showTopic,
  newTopic,
  newTopicWithPublicKey,
  newTopicWithMemo,
  newTopicWithMemoAndKey,
  accountBalance,
  consensusMessageResponse,
  transactionMessageResponse,
  updateTopic,
  updateTopicWithMemo
}
