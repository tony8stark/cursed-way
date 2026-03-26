import { describe, expect, it } from "vitest";
import { checkLocationQuest, getLocationQuestPreview } from "../location-quests";

describe("location quest loop", () => {
  it("lets broad exploration unlock a rare return quest earlier", () => {
    const quest = checkLocationQuest(
      "Port Royal",
      1,
      new Set(["lq_sunken_galleon"]),
      { exploredLocationCount: 6, roll: 0.05 },
    );

    expect(quest?.id).toBe("lq_ghost_captain");
  });

  it("shows a rumor preview when a return quest still needs wider exploration", () => {
    const preview = getLocationQuestPreview(
      "Port Royal",
      1,
      new Set(["lq_sunken_galleon"]),
      4,
    );

    expect(preview?.quest.id).toBe("lq_ghost_captain");
    expect(preview?.status).toBe("rumored");
    expect(preview?.note.en.toLowerCase()).toContain("discover");
  });

  it("shows a ready preview when the destination qualifies on the next arrival", () => {
    const preview = getLocationQuestPreview(
      "Port Royal",
      1,
      new Set(["lq_sunken_galleon"]),
      6,
    );

    expect(preview?.quest.id).toBe("lq_ghost_captain");
    expect(preview?.status).toBe("ready");
    expect(preview?.chance).toBeGreaterThan(0.1);
  });
});
