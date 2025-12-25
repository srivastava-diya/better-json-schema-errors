import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, setShouldValidateFormat, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import "@hyperjump/json-schema/draft-2019-09";
import "@hyperjump/json-schema/draft-07";
import "@hyperjump/json-schema/draft-06";
import "@hyperjump/json-schema/draft-04";
import "@hyperjump/json-schema/formats";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("format error handler", async () => {
  setShouldValidateFormat(true);

  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("format draft-2020-12 fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      format: "email"
    }, schemaUri);

    const instance = "invalid";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getFormatErrorMessage("email"),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/format`]
      }
    ]);
  });

  test("format draft-2019-09 fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2019-09/schema",
      format: "email"
    }, schemaUri);

    const instance = "invalid";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getFormatErrorMessage("email"),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/format`]
      }
    ]);
  });

  test("format draft-07 fail", async () => {
    registerSchema({
      $schema: "http://json-schema.org/draft-07/schema#",
      format: "email"
    }, schemaUri);

    const instance = "invalid";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getFormatErrorMessage("email"),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/format`]
      }
    ]);
  });

  test("format draft-06 fail", async () => {
    registerSchema({
      $schema: "http://json-schema.org/draft-06/schema#",
      format: "email"
    }, schemaUri);

    const instance = "invalid";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getFormatErrorMessage("email"),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/format`]
      }
    ]);
  });

  test("format draft-04 fail", async () => {
    registerSchema({
      $schema: "http://json-schema.org/draft-04/schema#",
      format: "email"
    }, schemaUri);

    const instance = "invalid";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getFormatErrorMessage("email"),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/format`]
      }
    ]);
  });

  test("format pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      format: "email"
    }, schemaUri);

    const instance = "valid@email.com";
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
