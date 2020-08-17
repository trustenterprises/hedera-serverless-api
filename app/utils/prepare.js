/*
 * Enable functions to be composed when checking middleware, validations and adding context
 *
 * e.g.
 * export default
 *   pipe(
 *     withAuthentication,
 *     withValidation,
 *     useHashgraphContext
 *   )(ExampleRouteHandler)
 *
 */

const prepare = (...fns) => x => fns.reverse().reduce((v, f) => f(v), x)

export default prepare
