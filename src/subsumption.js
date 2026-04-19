/**
 * @import { NormalizedOutput, InstanceOutput } from "./index.d.ts"
 */

/**
 * @typedef {{ loc: string, errors: NormalizedOutput[] | null }} FailedCondition
 */

/** @type {(altA: NormalizedOutput, altB: NormalizedOutput, getValue: (keywordLocation: string) => any) => boolean} */
export const isSubsumed = (altA, altB, getValue) => {
  for (const instLoc in altA) {
    if (!(instLoc in altB)) {
      return false;
    }

    const failedA = getFailedKeywords(altA[instLoc]);
    const failedB = getFailedKeywords(altB[instLoc]);

    for (const uriA in failedA) {
      for (const itemA of failedA[uriA]) {
        if (failedB[uriA] && failedB[uriA].some(/** @type {FailedCondition} */ (b) => b.loc === itemA.loc)) {
          continue;
        }

        const valA = getValue(itemA.loc);
        let subsumed = false;

        if (uriA === "https://json-schema.org/keyword/type") {
          subsumed = doesTypeSubsume(valA, failedB, getValue);
        } else if (uriA === "https://json-schema.org/keyword/enum") {
          subsumed = doesEnumSubsume(valA, failedB, getValue);
        } else if (uriA === "https://json-schema.org/keyword/maxLength" || uriA === "https://json-schema.org/keyword/maximum" || uriA === "https://json-schema.org/keyword/maxItems" || uriA === "https://json-schema.org/keyword/maxProperties" || uriA === "https://json-schema.org/keyword/maxContains") {
          subsumed = doesMaxBoundSubsume(uriA, valA, failedB, getValue);
        } else if (uriA === "https://json-schema.org/keyword/minLength" || uriA === "https://json-schema.org/keyword/minimum" || uriA === "https://json-schema.org/keyword/minItems" || uriA === "https://json-schema.org/keyword/minProperties" || uriA === "https://json-schema.org/keyword/minContains") {
          subsumed = doesMinBoundSubsume(uriA, valA, failedB, getValue);
        } else if (uriA === "https://json-schema.org/keyword/anyOf" || uriA === "https://json-schema.org/keyword/oneOf") {
          subsumed = doesAnyOfSubsume(itemA, altB, getValue);
        }

        if (!subsumed) {
          return false;
        }
      }
    }
  }

  return true;
};

/** @type {(valA: any, failedB: Record<string, FailedCondition[]>, getValue: (keywordLocation: string) => any) => boolean} */
const doesTypeSubsume = (valA, failedB, getValue) => {
  const typeA = Array.isArray(valA) ? valA : [valA];

  if (failedB["https://json-schema.org/keyword/type"]) {
    for (const itemB of failedB["https://json-schema.org/keyword/type"]) {
      const typeB = Array.isArray(getValue(itemB.loc)) ? getValue(itemB.loc) : [getValue(itemB.loc)];
      if (typeB.every(/** @param {any} t */ (t) => typeA.includes(t))) {
        return true;
      }
    }
  }

  if (typeA.includes("string") && (failedB["https://json-schema.org/keyword/minLength"] || failedB["https://json-schema.org/keyword/maxLength"] || failedB["https://json-schema.org/keyword/pattern"])) {
    return true;
  }
  if ((typeA.includes("number") || typeA.includes("integer")) && (failedB["https://json-schema.org/keyword/minimum"] || failedB["https://json-schema.org/keyword/maximum"] || failedB["https://json-schema.org/keyword/multipleOf"])) {
    return true;
  }
  if (typeA.includes("object") && (failedB["https://json-schema.org/keyword/properties"] || failedB["https://json-schema.org/keyword/required"])) {
    return true;
  }
  if (typeA.includes("array") && (failedB["https://json-schema.org/keyword/items"] || failedB["https://json-schema.org/keyword/minItems"])) {
    return true;
  }

  return false;
};

/** @type {(valA: any, failedB: Record<string, FailedCondition[]>, getValue: (keywordLocation: string) => any) => boolean} */
const doesEnumSubsume = (valA, failedB, getValue) => {
  const enumA = valA.map(/** @param {any} v */ (v) => JSON.stringify(v));

  if (failedB["https://json-schema.org/keyword/enum"]) {
    for (const itemB of failedB["https://json-schema.org/keyword/enum"]) {
      const enumB = getValue(itemB.loc).map(/** @param {any} v */ (v) => JSON.stringify(v));
      if (enumB.every(/** @param {any} v */ (v) => enumA.includes(v))) {
        return true;
      }
    }
  }

  if (failedB["https://json-schema.org/keyword/const"]) {
    for (const itemB of failedB["https://json-schema.org/keyword/const"]) {
      if (enumA.includes(JSON.stringify(getValue(itemB.loc)))) {
        return true;
      }
    }
  }
  return false;
};

/** @type {(uriA: string, valA: number, failedB: Record<string, FailedCondition[]>, getValue: (keywordLocation: string) => any) => boolean} */
const doesMaxBoundSubsume = (uriA, valA, failedB, getValue) => {
  if (failedB[uriA]) {
    for (const itemB of failedB[uriA]) {
      if (valA >= getValue(itemB.loc)) {
        return true;
      }
    }
  }
  return false;
};

/** @type {(uriA: string, valA: number, failedB: Record<string, FailedCondition[]>, getValue: (keywordLocation: string) => any) => boolean} */
const doesMinBoundSubsume = (uriA, valA, failedB, getValue) => {
  if (failedB[uriA]) {
    for (const itemB of failedB[uriA]) {
      if (valA <= getValue(itemB.loc)) {
        return true;
      }
    }
  }
  return false;
};

/** @type {(itemA: FailedCondition, altB: NormalizedOutput, getValue: (keywordLocation: string) => any) => boolean} */
const doesAnyOfSubsume = (itemA, altB, getValue) => {
  if (!itemA.errors) {
    return false;
  }
  for (const nestedAltA of itemA.errors) {
    if (isSubsumed(nestedAltA, altB, getValue)) {
      return true;
    }
  }
  return false;
};

/** @type {(output: InstanceOutput) => Record<string, FailedCondition[]>} */
const getFailedKeywords = (output) => {
  /** @type {Record<string, FailedCondition[]>} */
  const failed = {};
  for (const uri in output) {
    for (const loc in output[uri]) {
      const val = output[uri][loc];
      if (val === false || Array.isArray(val)) {
        if (!failed[uri]) {
          failed[uri] = [];
        }
        failed[uri].push({ loc, errors: Array.isArray(val) ? val : null });
      }
    }
  }
  return failed;
};
