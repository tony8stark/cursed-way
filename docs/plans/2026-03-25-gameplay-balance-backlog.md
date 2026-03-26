# Gameplay Balance Backlog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebalance progression, objectives, pacing, and systemic payoffs so `free_roam` remains purposeful, `expedition` remains tense, and the major playstyles feel equally viable.

**Architecture:** Treat gameplay balance as a sequence of narrow systemic passes instead of one large rewrite. Start with objective clarity and pacing because they shape every run, then add stronger systemic payoffs for factions, artifacts, location quests, and endings.

**Tech Stack:** Vite, React, TypeScript, Zustand, Vitest

---

## Priority Order

1. Objective Rebalance
2. Expedition/Free-Roam Pacing
3. Faction Payoffs
4. Artifact Economy
5. Location Quest Loop
6. Ending Payoffs

### Task 1: Rebalance Objectives Around Playstyle, Not Time

**Why first:** Objectives are the top-level promise of `free_roam`, but several are currently solved by patience rather than decision quality.

**Files:**
- Modify: `src/engine/objectives.ts`
- Modify: `src/ui/components/TitleScreen.tsx`
- Modify: `src/ui/components/MapScreen.tsx`
- Test: `src/engine/__tests__/objectives.spec.ts`

**Design target:**
- `treasure_hunter`: keep as-is; it already has a clear fantasy.
- `curse_breaker`: keep the 8 -> 0 arc, but expose clearer progress language and warning states.
- `explorer`: reward breadth, not just elapsed time; prefer named-location discovery over passive wandering.
- `trade_baron`: shift away from “hold 300 eventually” toward “reach wealth under pressure”.
- `redeemer`: keep as high-karma fantasy, but reduce grind or add clearer positive routes.
- `cartographer`: tune target so it rewards deliberate exploration instead of pure run length.

**Acceptance criteria:**
- Every objective should imply a distinct play pattern before the player starts the run.
- No objective should feel “basically guaranteed” in `free_roam`.
- No objective should feel origin-locked unless that is explicit in the UI.

### Task 2: Split Pacing Rules for `expedition` and `free_roam`

**Why second:** Current pacing is atmospheric, but `expedition` pays a higher cost for empty movement than `free_roam`.

**Files:**
- Modify: `src/engine/state.ts`
- Modify: `src/engine/encounter-picker.ts`
- Test: `src/engine/__tests__/state-save.spec.ts`
- Create: `src/engine/__tests__/pacing.spec.ts`

**Design target:**
- Keep `free_roam` spacious and atmospheric.
- Make `expedition` denser and more decision-rich per day.
- Reduce dead time in short-form mode without removing open-water identity.

**Acceptance criteria:**
- `expedition` runs should surface high-impact decisions earlier and more consistently.
- Empty sailing should still exist, but not consume too much of a 20-day run.
- Storylet variety should remain intact after pacing changes.

### Task 3: Turn Factions Into Real Route Shapers

**Why third:** Factions already generate numbers and flavor, but the run fantasy is not yet materially redirected by reputation.

**Files:**
- Modify: `src/engine/factions.ts`
- Modify: `src/engine/types.ts`
- Modify: `src/engine/state.ts`
- Modify: `src/quests/cursed-galleon/encounters.ts`
- Modify: `src/quests/cursed-galleon/encounters-en.ts`
- Modify: `src/ui/components/FactionBar.tsx`

**Design target:**
- Positive reputation should unlock better prices, safer access, or special options.
- Negative reputation should close doors, raise costs, or trigger hostile alternatives.
- Origins should feel like faction leaning, not faction destiny.

**Acceptance criteria:**
- A Crown-friendly run, Brethren run, and Guild run should produce visibly different choices.
- Faction meter should predict consequences, not just summarize history.

### Task 4: Normalize Artifact Value and Cursed-Item Readability

**Why fourth:** Some artifacts are clean upside while others are opaque penalties with delayed payoff.

**Files:**
- Modify: `src/engine/items.ts`
- Modify: `src/engine/items-i18n.ts`
- Modify: `src/quests/cursed-galleon/encounters.ts`
- Modify: `src/quests/cursed-galleon/encounters-en.ts`
- Modify: `src/ui/components/InventoryBar.tsx`
- Test: `src/engine/__tests__/state-save.spec.ts`

**Design target:**
- Keep cursed items dangerous, but telegraph why a player might still want them.
- Reduce “first-run trap” feeling for `ghost_lantern` and `voodoo_doll`.
- Keep strong utility artifacts valuable without making them universal best picks.

**Acceptance criteria:**
- Every artifact should have a readable use-case.
- Cursed items should feel risky-but-tempting, not randomly punishing.

### Task 5: Align Location Quests With Exploration Instead of Fighting It

**Why fifth:** The current loop asks the player to both roam broadly and revisit the same hubs repeatedly.

**Files:**
- Modify: `src/engine/location-quests.ts`
- Modify: `src/quests/cursed-galleon/location-quest-encounters.ts`
- Modify: `src/quests/cursed-galleon/location-quest-encounters-en.ts`
- Modify: `src/ui/components/MapScreen.tsx`
- Test: `src/renderer/__tests__/map-route.spec.ts`

**Design target:**
- Make revisit-based quests feel intentional rather than farmy.
- Strengthen regional identity of ports and landmarks.
- Give players clearer reasons to return besides probability fishing.

**Acceptance criteria:**
- Revisit quests should create anticipation, not repetition fatigue.
- Exploration objectives and location quest logic should no longer pull in opposite directions.

### Task 6: Expand Ending Resolution to Reflect More of the Run

**Why sixth:** The finale currently compresses complex runs into a small set of numeric summaries.

**Files:**
- Modify: `src/quests/cursed-galleon/endings.ts`
- Modify: `src/quests/cursed-galleon/endings-en.ts`
- Modify: `src/engine/ending-resolution.ts`
- Test: `src/engine/__tests__/ending-resolution.spec.ts`

**Design target:**
- Preserve stat-based endings, but add stronger reflection of faction alignment, key relationships, and major questline outcomes.
- Make the ending feel like a conclusion to “your captain”, not just “your numbers”.

**Acceptance criteria:**
- Major relationship arcs and alignment choices should influence the ending text or ending branch.
- Two runs with similar stats but different allegiances should not collapse into the same narrative payoff.

## Recommended First Slice

Start with **Task 1 only**.

Reason:
- It is the highest leverage design fix.
- It does not require rewriting content volume first.
- It gives a cleaner target for every later balance pass.

## Manual Validation Checklist

- Start a `free_roam` run with each origin and inspect whether the chosen objective implies a clear plan.
- Start an `expedition` run and count how many high-stakes decisions appear by day 5, day 10, and day 15.
- Check whether aggressive, merciful, and profit-first routes all remain viable without one clearly dominating.
- Check whether the run ending reflects more than `gold`, `karma`, and `curse`.
