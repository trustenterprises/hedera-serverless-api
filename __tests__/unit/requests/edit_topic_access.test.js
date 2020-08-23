import Config from 'app/config'
import Status from 'app/constants/status'
import { createMocks } from 'node-mocks-http';
import MockHashgraphResponse from 'mocks/static/hashgraph'
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import denyPost from "app/middleware/denyPost"
import withAuthentication from "app/middleware/withAuthentication"
import prepare from 'app/utils/prepare'

function mockTopicHandler(req, res) {
  return true;
}

const injectedTopicHandler = prepare(
  denyPost,
  withAuthentication,
  useMockedHashgraphContext
)(mockTopicHandler)

test("Test methodNotAllowed handler for '/consensus/topic/:id", async () => {
  const { req, res } = createMocks({
     method: 'POST'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.METHOD_NOT_ALLOWED);
})

test("Test GET unauthorised handler for '/consensus/topic/:id", async () => {
  const { req, res } = createMocks({
     method: 'GET'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test PUT unauthorised handler for '/consensus/topic/:id", async () => {
  const { req, res } = createMocks({
     method: 'PUT'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})

test("Test DELETE unauthorised handler for '/consensus/topic/:id", async () => {
  const { req, res } = createMocks({
     method: 'DELETE'
   });

  await injectedTopicHandler(req, res)

  expect(res._getStatusCode()).toBe(Status.UNAUTHORIZED);
})
