/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const maxItemsNormalizationHandler = {
  appliesTo(type) {
    return type === "array";
  }
};

export default maxItemsNormalizationHandler;
