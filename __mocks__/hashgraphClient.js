// Mocked hashgraph client for injection
import HashgraphClientContract from 'app/hashgraph/contract'
import Config from "app/config"

class mockedHashgraphClient extends HashgraphClientContract {

  // Example response when creating a new topic
  async createNewTopic () {
    return {
      topic: {
        shard: 0,
        realm: 0,
        topic: 127561
      },
      submitPublicKey: "302a300506032b657003210034314146f2f694822547af9007baa32fcc5a6962e7c5141333846a6cf04b64ca"
    }
  }
}

export default mockedHashgraphClient
