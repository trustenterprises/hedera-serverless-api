import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import createTopicHandler from 'app/handler/createTopicHandler';
import prepare from 'app/utils/prepare'

const injectedTopicHandler = prepare(
  onlyPost,
  withAuthentication,
  useMockedHashgraphContext
)(createTopicHandler)

test("Test unauthorised handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'POST'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test bad method handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks();

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.METHOD_NOT_ALLOWED);
})

test("Test success handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(200);
  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: {
        topic: {
          shard: 0,
          realm: 0,
          topic: 127561
        },
        submitPublicKey: "302a300506032b657003210034314146f2f694822547af9007baa32fcc5a6962e7c5141333846a6cf04b64ca"
      }
    }),
  );
})
