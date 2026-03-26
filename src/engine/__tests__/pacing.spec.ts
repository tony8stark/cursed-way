import { describe, expect, it } from "vitest";
import { getCandidatePoolSize, getFamilyPacingMultiplier, shouldTriggerEmptySailing } from "../pacing";

describe("pacing", () => {
  it("keeps free roam calmer than expedition while en route", () => {
    expect(
      shouldTriggerEmptySailing({
        mode: "expedition",
        isEnRoute: true,
        currentLocationName: null,
        roll: 0.2,
      }),
    ).toBe(false);

    expect(
      shouldTriggerEmptySailing({
        mode: "free_roam",
        isEnRoute: true,
        currentLocationName: null,
        roll: 0.2,
      }),
    ).toBe(true);
  });

  it("never allows empty sailing at named locations or while stationary", () => {
    expect(
      shouldTriggerEmptySailing({
        mode: "free_roam",
        isEnRoute: false,
        currentLocationName: null,
        roll: 0,
      }),
    ).toBe(false);

    expect(
      shouldTriggerEmptySailing({
        mode: "free_roam",
        isEnRoute: true,
        currentLocationName: "Tortuga",
        roll: 0,
      }),
    ).toBe(false);
  });

  it("makes expedition favor high-impact families more than free roam", () => {
    expect(getFamilyPacingMultiplier("expedition", "ambient")).toBeLessThan(
      getFamilyPacingMultiplier("free_roam", "ambient"),
    );
    expect(getFamilyPacingMultiplier("expedition", "consequence")).toBeGreaterThan(
      getFamilyPacingMultiplier("free_roam", "consequence"),
    );
    expect(getFamilyPacingMultiplier("expedition", "setpiece")).toBeGreaterThan(
      getFamilyPacingMultiplier("free_roam", "setpiece"),
    );
  });

  it("uses a tighter candidate pool in expedition", () => {
    expect(getCandidatePoolSize("expedition", 20)).toBeLessThan(getCandidatePoolSize("free_roam", 20));
    expect(getCandidatePoolSize("expedition", 2)).toBe(2);
    expect(getCandidatePoolSize("free_roam", 2)).toBe(2);
  });
});
