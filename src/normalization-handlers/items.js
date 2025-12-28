import { evaluateSchema } from "../json-schema-errors.js";
import * as Instance from "@hyperjump/json-schema/instance/experimental";
import * as Pact from "@hyperjump/pact";

/**
 * @import { KeywordHandler, NormalizedOutput } from "../index.d.ts"
 * @import { EvaluatedItemsContext } from "./unevaluatedItems.js"
 */

/** @type KeywordHandler<[number, string], EvaluatedItemsContext> */
const itemsNormalizationHandler = {
  evaluate([numberOfPrefixItems, items], instance, context) {
    /** @type NormalizedOutput[] */
    const outputs = [];

    if (Instance.typeOf(instance) !== "array") {
      return outputs;
    }

    for (const itemNode of Pact.drop(numberOfPrefixItems, Instance.iter(instance))) {
      outputs.push(evaluateSchema(items, itemNode, context));
    }

    return outputs;
  },
  simpleApplicator: true
};

export default itemsNormalizationHandler;
