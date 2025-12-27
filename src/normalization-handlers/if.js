import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler<string> */
const ifNormalizationHandler = {
  evaluate(ifLocation, instance, context) {
    return [evaluateSchema(ifLocation, instance, context)];
  },
  simpleApplicator: true
};

export default ifNormalizationHandler;
