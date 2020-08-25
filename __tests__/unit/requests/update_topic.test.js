import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import withAuthentication from "app/middleware/withAuthentication"
import updateTopicHandler from 'app/handler/updateTopicHandler';
import prepare from 'app/utils/prepare'

const injectedTopicHandler = prepare(
  withAuthentication,
  useMockedHashgraphContext
)(updateTopicHandler)

test("Test unauthorised handler for updating'/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'PUT'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
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
      data: MockHashgraphResponse.updateTopic
    }),
  );
})

test("Test success handler with memo for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'PUT',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       memo: "hello" // This is returned in the update topic response
     }
   });

  await injectedTopicHandler(req, res)

  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.updateTopicWithMemo
    }),
  );
})

test("Test bad memo handler with for '/consensus/topic'", async () => {
  const { req, res } = createMocks({
     method: 'POST',
     headers: {
       'x-api-key': Config.authenticationKey
     },
     body: {
       memo: 1
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNPROCESSIBLE_ENTITY);
})
