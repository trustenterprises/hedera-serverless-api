import Request from "app/constants/request"
import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import prepare from 'app/utils/prepare'
import TopicInfoHandler from "app/handler/topicInfoHandler"

const injectedTopicHandler = prepare(
  useMockedHashgraphContext
)(TopicInfoHandler)

test("Test GET topic with id '/consensus/topic/:id", async () => {
  const { req, res } = createMocks({
    method: 'GET',
    headers: {
      'x-api-key': Config.authenticationKey
    },
    query: {
      id: "0.0.131683"
    }
  });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.OK);

  const result = JSON.parse(res._getData())
  const { data } = result

  expect(data.topicMemo).toBe("test");
  expect(data.adminKey).toBe(null);
  expect(data.submitKey).toBe(null);
  expect(data.autoRenewAccount).toBe(null);
})
