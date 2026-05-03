---
description: Hearthstone Core project conventions - testing, new features, and card implementation
alwaysApply: true
---

# Hearthstone Core Project Conventions

## Code

- Use English for comments and documentation (both tests and implementation should have appropriate comments).

## Test Case Design

- **Single scenario**: One test covers one multi-step scenario.
- **Entity naming**: Use concrete entity names (e.g. `wisp`), not vague terms like "a card".
- **Exercise the mechanic**: The scenario must verify the card under test’s core mechanic (battlecry, deathrattle, draw, etc.).
- **Keep it simple**: Minimize entities involved; steps should be clear.
- **Correct process**: Damage, death, and resolution order must match the rules.
- **Necessary assertions only**: Assert only behavior relevant to the feature under test; do not assert base stats or other unrelated properties.
- **Simulate player behavior only**: Use public APIs only (deployer.launch, controller.selectTarget, game.nextTurn, role.action.launch). Do not call internal functions directly (e.g., no `role.receiveDamage({ value: 10 })`).

## New Feature Development

1. Look up the card’s exact effect (cost, stats, all keywords, effect text) before writing anything.
2. **Before writing any spec or code**, read `src/index.spec.md` as implementation reference — it contains all patterns, the model tree, enums, and a reference card index.
3. **Implement the effect first** (feat.ts + index.ts according to patterns in `src/index.spec.md`).
4. **If encountering unimplemented general features**: propose implementation approach to user for approval before proceeding.
5. **Stop and confirm implementation correctness** with the user before proceeding to test design.
6. **Design test scenarios** that simulate player behavior (deployer.launch, controller.selectTarget, game.nextTurn, role.action.launch). Do not call internal functions directly (e.g., no `role.receiveDamage({ value: 10 })`).
7. **Implement tests** (index.test.ts) according to designed scenarios.
8. **Update index.spec.md** to include:
   - **Rules**: Card name, cost/stats, effect description, edge cases.
   - **Implementation**: Core components, data flow (trigger → execute → result).
   - **Test scenarios**: Setup, flow, and per-case assertions.
   - **Reference cards**: Reference cards and reference effects the design builds on.
9. After implementation, mark the card as completed (`[x]`) in the relevant `src/cards/<class>/todo.md`.
10. If the implementation introduces a new pattern not yet covered in `src/index.spec.md`, append it to the appropriate section of that file.

## Workflow

- **Do not run tests on your own.** Only run tests when the user explicitly asks.
- **`src/index.spec.md` is the single implementation reference.** Keep it up to date: any new mechanic, pattern, or model relationship discovered during implementation must be reflected there before the task is considered done.
- **`src/cards/<class>/todo.md` must be updated** after every card implementation — move the card from the uncompleted list to the completed list.
