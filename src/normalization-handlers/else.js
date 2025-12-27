import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler<[string, string]> */
const elseNormalizationHandler = {
  evaluate([, elseLocation], instance, context) {
    return [evaluateSchema(elseLocation, instance, context)];
  },
  simpleApplicator: true
};

export default elseNormalizationHandler;
