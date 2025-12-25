import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("enum error handler", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("enum fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      enum: ["foo", "bar"]
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getEnumErrorMessage(["foo", "bar"]),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/enum`]
      }
    ]);
  });

  test("enum pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      enum: ["foo", "bar"]
    }, schemaUri);

    const instance = "foo";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
