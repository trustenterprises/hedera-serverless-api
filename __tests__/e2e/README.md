## Hashgraph API Client E2E tests

These tests are avoided in regular **test** and **test:watch** scenarios, including for the Github actions.

They directly call the client and spend HBARs. It is recommended to use these tests for only testing the client against Testnet.

The entire test suite can be called with:

```
yarn test:all
```
