# Trust Enterprises: Serverless Hedera API

Welcome to the serverless hedera API, you can find out more about the project and running your first client through [reading the docs](https://docs.trust.enterprises).

You can look at our postman docs by clicking the button below.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/run-collection/e61a0c42e7d572890996)

## Deploy with 1 click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https://github.com/trustenterprises/hedera-serverless-consensus&env=HEDERA_NETWORK,HEDERA_ACCOUNT_ID,HEDERA_PRIVATE_KEY,API_SECRET_KEY&envDescription=Enter%20your%20account%20id%20and%20private%20key%20from%20the%20hedera%20portal.%20The%20API%20secret%20is%20your%20authentication%20key%20to%20communicate%20with%20your%20API,%20create%20a%20secure%20string%20of%20at%20least%2010%20characters.&envLink=https%3A%2F%2Fdocs.trust.enterprises%2Fdeployment%2Fenvironment-variables&redirect-url=https%3A%2F%2Fdocs.trust.enterprises%2Frest-api%2Foverview)

## Developing and testing locally

- Setup your environment variables
- Run the linter and basic tests

```
yarn lint
yarn test
```

If you want to run all the tests, including the e2e tests for your config use:

```
yarn test:all
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

Have a look at the [REST API documentation](https://docs.trust.enterprises/rest-api/overview) to see how you can start sending requests to your new shiny client.
