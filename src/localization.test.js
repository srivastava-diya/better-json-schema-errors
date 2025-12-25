import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { rm, writeFile } from "node:fs/promises";
import { Localization } from "./localization.js";

describe("Localization", () => {
  const fixtureLocale = "fx-TR";

  beforeEach(async () => {
    await writeFile(`src/translations/${fixtureLocale}.ftl`, "example = message");
  });

  afterEach(async () => {
    await rm(`src/translations/${fixtureLocale}.ftl`);
  });

  test("unsupported locale", async () => {
    const localization = Localization.forLocale("xx-XX");
    await expect(localization).rejects.to.throw(Error);
  });

  test("unsupported message", async () => {
    const localization = await Localization.forLocale(fixtureLocale);
    expect(() => localization.getFalseSchemaErrorMessage()).to.throw(Error);
  });
});
