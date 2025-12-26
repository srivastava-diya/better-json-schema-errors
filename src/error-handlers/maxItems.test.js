import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("maxItems error handler", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("maxItems fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      maxItems: 1
    }, schemaUri);

    const instance = ["foo", "bar"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getMaxItemsErrorMessage(1),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/maxItems`]
      }
    ]);
  });

  test("maxItems pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      maxItems: 1
    }, schemaUri);

    const instance = ["foo"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
