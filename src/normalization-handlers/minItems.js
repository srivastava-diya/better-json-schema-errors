/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const minItemsNormalizationHandler = {
  appliesTo(type) {
    return type === "array";
  }
};

export default minItemsNormalizationHandler;
