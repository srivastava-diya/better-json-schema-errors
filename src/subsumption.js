import { getSchema } from "@hyperjump/json-schema/experimental";
import * as Schema from "@hyperjump/browser";

/**
 * @import { NormalizedOutput, InstanceOutput } from "./index.d.ts"
 */

const MAX_BOUNDARY_KEYWORDS = new Set([
  "https://json-schema.org/keyword/maximum",
  "https://json-schema.org/keyword/exclusiveMaximum",
  "https://json-schema.org/keyword/maxLength",
  "https://json-schema.org/keyword/maxItems",
  "https://json-schema.org/keyword/maxProperties"
]);

const MIN_BOUNDARY_KEYWORDS = new Set([
  "https://json-schema.org/keyword/minimum",
  "https://json-schema.org/keyword/exclusiveMinimum",
  "https://json-schema.org/keyword/minLength",
  "https://json-schema.org/keyword/minItems",
  "https://json-schema.org/keyword/minProperties"
]);

/**
 * @param {NormalizedOutput} altA - subsuming alternative
 * @param {NormalizedOutput} altB - subsumed alternative
 * @returns {Promise<boolean>} true if altA subsumes altB
 */
export const isSubsumed = async (altA, altB) => {
  for (const instanceLocation in altA) {
    if (!(instanceLocation in altB)) {
      return false;
    }

    const failingA = getFailingKeywordUris(altA[instanceLocation]);
    const failingB = getFailingKeywordUris(altB[instanceLocation]);

    for (const keywordUri of failingA) {
      if (!failingB.has(keywordUri)) {
        return false;
      }
    }

    for (const keywordUri of failingA) {
      const subsumed = await isKeywordSubsumed(keywordUri, altA[instanceLocation][keywordUri], altB[instanceLocation][keywordUri]);
      if (!subsumed) {
        return false;
      }
    }
  }

  return true;
};

/**
 * @param {InstanceOutput} output
 * @returns {Set<string>}
 */
const getFailingKeywordUris = (output) => {
  /** @type {Set<string>} */
  const failing = new Set();

  for (const keywordUri in output) {
    for (const keywordLocation in output[keywordUri]) {
      const value = output[keywordUri][keywordLocation];
      if (value !== true) {
        failing.add(keywordUri);
        break;
      }
    }
  }

  return failing;
};

/**
 * @param {string} keywordUri
 * @param {Record<string, boolean | NormalizedOutput[]>} keywordOutputA
 * @param {Record<string, boolean | NormalizedOutput[]>} keywordOutputB
 * @returns {Promise<boolean>}
 */
const isKeywordSubsumed = async (keywordUri, keywordOutputA, keywordOutputB) => {
  if (MAX_BOUNDARY_KEYWORDS.has(keywordUri)) {
    return isBoundarySubsumed(keywordOutputA, keywordOutputB, "max");
  }

  if (MIN_BOUNDARY_KEYWORDS.has(keywordUri)) {
    return isBoundarySubsumed(keywordOutputA, keywordOutputB, "min");
  }

  return false;
};

/**
 * @param {Record<string, boolean | NormalizedOutput[]>} keywordOutputA
 * @param {Record<string, boolean | NormalizedOutput[]>} keywordOutputB
 * @param {"max" | "min"} direction
 * @returns {Promise<boolean>}
 */
const isBoundarySubsumed = async (keywordOutputA, keywordOutputB, direction) => {
  const valueA = await getEffectiveBoundaryValue(keywordOutputA, direction);
  const valueB = await getEffectiveBoundaryValue(keywordOutputB, direction);

  if (valueA === undefined || valueB === undefined) {
    return false;
  }

  return direction === "max" ? valueA >= valueB : valueA <= valueB;
};

/**
 * @param {Record<string, boolean | NormalizedOutput[]>} keywordOutput
 * @param {"max" | "min"} direction
 * @returns {Promise<number | undefined>}
 */
const getEffectiveBoundaryValue = async (keywordOutput, direction) => {
  let effectiveValue = direction === "max" ? -Infinity : Infinity;
  let hasFailure = false;

  for (const keywordLocation in keywordOutput) {
    if (keywordOutput[keywordLocation] === true) {
      continue;
    }

    hasFailure = true;
    const keyword = await getSchema(keywordLocation);
    const value = /** @type {number} */ (Schema.value(keyword));

    if (direction === "max") {
      effectiveValue = Math.max(effectiveValue, value);
    } else {
      effectiveValue = Math.min(effectiveValue, value);
    }
  }

  return hasFailure ? effectiveValue : undefined;
};
