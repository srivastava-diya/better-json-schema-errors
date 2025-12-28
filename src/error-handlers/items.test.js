import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("items keyword", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("items with false schema", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      prefixItems: [{ type: "number" }],
      items: false
    }, schemaUri);

    const instance = [42, "foo"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getBooleanSchemaErrorMessage(),
        instanceLocation: "#/1",
        schemaLocations: [`${schemaUri}#/items`]
      }
    ]);
  });

  test("items with object schema", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      prefixItems: [{ type: "number" }],
      items: { type: "string" }
    }, schemaUri);

    const instance = [42, null];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getTypeErrorMessage(["string"]),
        instanceLocation: "#/1",
        schemaLocations: [`${schemaUri}#/items/type`]
      }
    ]);
  });

  test("items on a non-object", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      prefixItems: [{ type: "number" }],
      items: { type: "string" }
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });

  test("items pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      prefixItems: [{ type: "number" }],
      items: { type: "string" }
    }, schemaUri);

    const instance = [42, "foo"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
