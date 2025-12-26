/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const multipleOfNormalizationHandler = {
  appliesTo(type) {
    return type === "number";
  }
};

export default multipleOfNormalizationHandler;
