import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("minItems error handler", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("minItems fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      minItems: 1
    }, schemaUri);

    /** @type string[] */
    const instance = [];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getMinItemsErrorMessage(1),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/minItems`]
      }
    ]);
  });

  test("minItems pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      minItems: 1
    }, schemaUri);

    const instance = ["foo"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
