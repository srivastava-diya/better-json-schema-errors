import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { JsonSchemaErrorsOutputPlugin } from "./output-plugin.js";
import { isSubsumed } from "./subsumption.js";

/**
 * @import { NormalizedOutput } from "./index.d.ts"
 */

const schemaUri = "https://example.com/subsumption-test";
const dialectUri = "https://json-schema.org/draft/2020-12/schema";

describe("isSubsumed", () => {
  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  describe("boundary keywords", () => {
    describe("maxLength", () => {
      test("higher maxLength subsumes lower maxLength", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "string", maxLength: 4 },
            { type: "string", maxLength: 2 }
          ]
        }, "hello");

        // alt[0] (maxLength: 4) subsumes alt[1] (maxLength: 2)
        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        // alt[1] does NOT subsume alt[0]
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });

      test("equal maxLength values subsume each other", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "string", maxLength: 3 },
            { type: "string", maxLength: 3 }
          ]
        }, "hello");

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(true);
      });
    });

    describe("minLength", () => {
      test("lower minLength subsumes higher minLength", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "string", minLength: 3 },
            { type: "string", minLength: 10 }
          ]
        }, "hi");

        // alt[0] (minLength: 3) subsumes alt[1] (minLength: 10) — more permissive
        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("maximum", () => {
      test("higher maximum subsumes lower maximum", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "number", maximum: 100 },
            { type: "number", maximum: 50 }
          ]
        }, 200);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("minimum", () => {
      test("lower minimum subsumes higher minimum", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "number", minimum: 5 },
            { type: "number", minimum: 20 }
          ]
        }, 1);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("exclusiveMaximum", () => {
      test("higher exclusiveMaximum subsumes lower", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "number", exclusiveMaximum: 100 },
            { type: "number", exclusiveMaximum: 50 }
          ]
        }, 200);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("exclusiveMinimum", () => {
      test("lower exclusiveMinimum subsumes higher", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "number", exclusiveMinimum: 5 },
            { type: "number", exclusiveMinimum: 20 }
          ]
        }, 1);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("maxItems", () => {
      test("higher maxItems subsumes lower", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "array", maxItems: 5 },
            { type: "array", maxItems: 2 }
          ]
        }, [1, 2, 3, 4, 5, 6]);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("minItems", () => {
      test("lower minItems subsumes higher", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "array", minItems: 3 },
            { type: "array", minItems: 10 }
          ]
        }, [1]);

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("maxProperties", () => {
      test("higher maxProperties subsumes lower", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "object", maxProperties: 3 },
            { type: "object", maxProperties: 1 }
          ]
        }, { a: 1, b: 2, c: 3, d: 4 });

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });

    describe("minProperties", () => {
      test("lower minProperties subsumes higher", async () => {
        const alts = await getAnyOfAlternatives({
          anyOf: [
            { type: "object", minProperties: 2 },
            { type: "object", minProperties: 5 }
          ]
        }, { a: 1 });

        expect(await isSubsumed(alts[0], alts[1])).toBe(true);
        expect(await isSubsumed(alts[1], alts[0])).toBe(false);
      });
    });
  });

  /** @type {(schema: import("@hyperjump/json-schema").SchemaObject, instance: *) => Promise<NormalizedOutput[]>} */

  const getAnyOfAlternatives = async (schema, instance) => {
    registerSchema(schema, schemaUri, dialectUri);

    const outputPlugin = new JsonSchemaErrorsOutputPlugin();
    await validate(schemaUri, instance, { plugins: [outputPlugin] });

    const anyOfOutput = outputPlugin.output["#"]?.["https://json-schema.org/keyword/anyOf"];
    const anyOfLocation = Object.keys(anyOfOutput ?? {})[0];
    const alternatives = /** @type {NormalizedOutput[]} */ (anyOfOutput?.[anyOfLocation]);

    if (!Array.isArray(alternatives)) {
      throw new Error("Expected anyOf alternatives array, got: " + typeof alternatives);
    }

    return alternatives;
  };
});
