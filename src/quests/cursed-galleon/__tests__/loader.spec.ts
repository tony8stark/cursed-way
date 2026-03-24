import { describe, expect, it } from "vitest";
import { loadCursedGalleon } from "..";

describe("cursed galleon loader", () => {
  it("loads English quest content on demand", async () => {
    const quest = await loadCursedGalleon("en");

    expect(quest.title).toBe("BLACK TIDE");
    expect(quest.description).toContain("Every choice has consequences");
  });

  it("loads Ukrainian quest content on demand", async () => {
    const quest = await loadCursedGalleon("uk");

    expect(quest.title).toBe("ЧОРНИЙ ПРИЛИВ");
    expect(quest.description).toContain("Кожен вибір має наслідки");
  });
});
