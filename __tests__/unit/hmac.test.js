import Hmac from "app/utils/hmac"
import MockHashgraphResponse from 'mocks/static/hashgraph'

const { consensusMessageResponse } = MockHashgraphResponse
const mockResponseAsString = JSON.stringify(consensusMessageResponse)

test("Generate a HMAC signature using a json string", () => {
  const hmac = Hmac.generateHash(mockResponseAsString)

	expect(typeof hmac).toBe("string")
})

test("Expect exception when hash is generateHash where the payload is not a string", () => {
  expect(() => Hmac.generateHash(consensusMessageResponse))
    .toThrow('Your payload object must be converted in to a string');
})


test("Generate a HMAC signature then validate signature hash", () => {
  const hmac = Hmac.generateHash(mockResponseAsString)
  const isSignatureValid = Hmac.validateSignature(mockResponseAsString, hmac)

  expect(isSignatureValid).toBe(true)
})
