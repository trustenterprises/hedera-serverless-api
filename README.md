## Serverless Hedera API

Note: Thi

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Deploy with 1 click [WIP]

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/mattsmithies/hedera-serverless-consensus)


## Initial TODO: WIP preparation for beta release.


## Getting Started

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

# Architecture Rationale & Guidelines (Likely to be moved to another page/docs)

The architecture is more or less custom as the API layer on a NextJS app is very thin, it focuses on using simple **handlers** for processing API requests.

All API requests hit the `pages/api` directory, are processed by a defined set of middleware, then if successfull forwarded to a given handler.

You can consider `app/handlers` to effectively be invokable single function controllers.

The validation for a given handler is expected to be tightly coupled to the code, as it is simpler to test a handler in isolation.

As the Hedera Hashgraph costs a small amount of real monies, we have created a mock that is injected into the handlers during the basic set of tests to prove additional logic for the API query and body parameters.

All other items that validate and inject into a handler are do so at the API route layer. We use a `process` function to chain a list of middleware, authentication validation and context injection before hit in the handler. Providing a higher degree of flexible testability.

Due the constraints of Vercel only providing a maximum of 12 unique routes for a free account, this can be slightly overcome through leveraging a routing to handler approach.

The topic handler `pages/api/consensus/topic/[id].js` provides additional insight to how to wrap a single route to manage a given resource consisting of different handlers.

Thank you to [James Wrightson](https://github.com/guerrillacontra) for your insight on handling injecting additional functionality as **context** for a given handler.

---

## Note: Most of below will be removed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
