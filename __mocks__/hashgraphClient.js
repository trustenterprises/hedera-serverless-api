// Mocked hashgraph client for injection
import HashgraphClientContract from 'app/hashgraph/contract'
import MockHashgraphResponse from './static/hashgraph'
import Config from "app/config"

class mockedHashgraphClient extends HashgraphClientContract {

  // Example response when creating a new topic
  async createNewTopic ({
		memo,
		enable_private_submit_key
	}) {
    if (memo && enable_private_submit_key) {
      return MockHashgraphResponse.newTopicWithMemoAndKey
		}

    if (memo) {
      return MockHashgraphResponse.newTopicWithMemo
    }

    if (enable_private_submit_key) {
      return MockHashgraphResponse.newTopicWithPublicKey
    }

    return MockHashgraphResponse.newTopic
  }

  async getTopicInfo () {
    return MockHashgraphResponse.showTopic
  }

  async updateTopic ({ memo }) {

    if (memo) {
      return MockHashgraphResponse.updateTopicWithMemo
    }

    return MockHashgraphResponse.updateTopic
  }

  // Example response returning the account balance
  async accountBalanceQuery () {
    return MockHashgraphResponse.accountBalance
  }

  // Example response returning the account balance
  async sendConsensusMessage ({
    allow_synchronous_consensus
  }) {
    if (allow_synchronous_consensus) {
      return MockHashgraphResponse.transactionMessageResponse
    }

    return MockHashgraphResponse.consensusMessageResponse
  }
}

export default mockedHashgraphClient
