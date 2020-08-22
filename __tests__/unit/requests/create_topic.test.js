import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
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

test("Test unauthorised handler for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test bad method handler for '/consensus/topic'", async () => {
  const { req, res } = createMocks();

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.METHOD_NOT_ALLOWED);
})

test("Test success handler for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.OK);

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.newTopic
    }),
  );
})

test("Test success handler with memo for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       memo: "hello"
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.newTopicWithMemo
    }),
  );
})

test("Test success handler with memo and key for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       memo: "hello",
       enable_private_submit_key: true
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.newTopicWithMemoAndKey
    }),
  );
})

test("Test success handler with key for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       enable_private_submit_key: true
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.newTopicWithPublicKey
    }),
  );
})

test("Test fail validation handler for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       memo: 1,
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNPROCESSIBLE_ENTITY);
})
