import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import onlyGet from "app/middleware/onlyGet"
import withAuthentication from "app/middleware/withAuthentication"
import getAccountBalanceHandler from 'app/handler/getAccountBalanceHandler';
import prepare from 'app/utils/prepare'

const injectedTopicHandler = prepare(
  onlyGet,
  withAuthentication,
  useMockedHashgraphContext
)(getAccountBalanceHandler)

test("Test unauthorised handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'GET'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test bad method handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'POST'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.METHOD_NOT_ALLOWED);
})

test("Test success handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'GET',
     headers: {
       'x-api-key': Config.authenticationKey
     }
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(200);
  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      data: MockHashgraphResponse.accountBalance
    }),
  );
})
