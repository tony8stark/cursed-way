import { describe, expect, it } from "vitest";
import { findNpcIdByMetFlag } from "../npc-met-flags";

describe("findNpcIdByMetFlag", () => {
  it("maps known met flags to NPC ids", () => {
    expect(findNpcIdByMetFlag("met_bones")).toBe("first_mate_bones");
    expect(findNpcIdByMetFlag("met_pirate_queen")).toBe("pirate_queen");
    expect(findNpcIdByMetFlag("met_bosun")).toBe("bosun");
  });

  it("returns null for unknown flags", () => {
    expect(findNpcIdByMetFlag("met_unknown")).toBeNull();
    expect(findNpcIdByMetFlag("combat_fought")).toBeNull();
  });
});
