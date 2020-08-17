import { createMocks } from 'node-mocks-http';
import useMockedHashgraphContext from 'mocks/useMockedHashgraphContext'
import createTopicHandler from 'app/handler/createTopicHandler';
import prepare from 'app/utils/prepare'

test("Test handler for '/consensus/createTopic'", async () => {
  const { req, res } = createMocks({
     method: 'GET',
   });

  const injectedTopicHandler = prepare(
   useMockedHashgraphContext
  )(createTopicHandler)

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
