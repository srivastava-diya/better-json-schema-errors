import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler<[string, string]> */
const thenNormalizationHandler = {
  evaluate([, then], instance, context) {
    return [evaluateSchema(then, instance, context)];
  },
  simpleApplicator: true
};

export default thenNormalizationHandler;
