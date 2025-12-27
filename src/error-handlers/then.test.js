import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("then keyword", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("if/then fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      if: { minimum: 10 },
      then: { multipleOf: 5 }
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getMultipleOfErrorMessage(5),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/then/multipleOf`]
      }
    ]);
  });

  test("if/then pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      if: { minimum: 10 },
      then: { multipleOf: 5 }
    }, schemaUri);

    const instance = 45;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
