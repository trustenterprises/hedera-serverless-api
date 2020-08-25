import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import onlyPost from "app/middleware/onlyPost"
import withAuthentication from "app/middleware/withAuthentication"
import createConsensusMessageHandler from 'app/handler/createConsensusMessageHandler';
import prepare from 'app/utils/prepare'

const injectedTopicHandler = prepare(
  onlyPost,
  withAuthentication,
  useMockedHashgraphContext
)(createConsensusMessageHandler)

test("Test unauthorised handler for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test bad method handler for '/consensus/message'", async () => {
  const { req, res } = createMocks();

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.METHOD_NOT_ALLOWED);
})

test("Test success handler for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNPROCESSIBLE_ENTITY);
})

test("Topic id required for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       message: "hello"
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNPROCESSIBLE_ENTITY);
})

test("Test success handler with memo for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       message: "hello",
       topic_id: '0.0.123'
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.consensusMessageResponse
    }),
  );
})

test("Test validation failed handler with message & bad bool for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       message: "hello",
       topic_id: '0.0.123',
       allow_synchronous_consensus: 1
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNPROCESSIBLE_ENTITY);
})

test("Test success handler with message and key for '/consensus/message'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       message: "hello",
       topic_id: '0.0.123',
       allow_synchronous_consensus: true
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.transactionMessageResponse
    }),
  );
})
