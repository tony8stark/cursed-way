import { describe, expect, it } from "vitest";
import { encounters } from "../../quests/cursed-galleon/encounters";
import { newEncounters } from "../../quests/cursed-galleon/encounters-new";

describe("faction payoff content", () => {
  it("adds a guild contract choice at the shipwright", () => {
    const encounter = newEncounters.find(({ id }) => id === "port_shipwright");

    expect(encounter?.choices.some(choice => choice.requires_rep?.guild === 3)).toBe(true);
  });

  it("adds a brethren favor choice in Nassau or Tortuga", () => {
    const encounter = encounters.find(({ id }) => id === "nassau_tavern");

    expect(encounter?.choices.some(choice => choice.requires_rep?.brethren === 3)).toBe(true);
  });

  it("adds a crown quartermaster choice at Port Royal", () => {
    const encounter = encounters.find(({ id }) => id === "port_royal_fort");

    expect(encounter?.choices.some(choice => choice.requires_rep?.crown === 3)).toBe(true);
  });
});
