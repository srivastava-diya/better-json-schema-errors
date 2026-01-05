import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { NormalizationHandler } from "../index.d.ts"
 */

/** @type NormalizationHandler<string> */
const notNormalizationHandler = {
  evaluate(not, instance, context) {
    return [evaluateSchema(not, instance, context)];
  }
};

export default notNormalizationHandler;
