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

## New Feature Development

1. Look up the card’s exact effect (cost, stats, all keywords, effect text) before writing anything.
2. **Before writing any spec or code**, read `src/index.spec.md` as implementation reference — it contains all patterns, the model tree, enums, and a reference card index.
3. Write the technical spec first (see e.g. loot-hoarder’s index.spec.md). It must include:
   - **Rules**: Card name, cost/stats, effect description, edge cases.
   - **Implementation**: Core components, data flow (trigger → execute → result).
   - **Test scenario**: Setup, flow, and per-case assertions.
   - **Reference cards**: Reference cards and reference effects the design builds on.
4. Implement the card and tests according to the spec.
5. After implementation, mark the card as completed (`[x]`) in the relevant `src/cards/<class>/todo.md`.
6. If the implementation introduces a new pattern not yet covered in `src/index.spec.md`, append it to the appropriate section of that file.

## Workflow

- **Do not run tests on your own.** Only run tests when the user explicitly asks.
- **`src/index.spec.md` is the single implementation reference.** Keep it up to date: any new mechanic, pattern, or model relationship discovered during implementation must be reflected there before the task is considered done.
- **`src/cards/<class>/todo.md` must be updated** after every card implementation — move the card from the uncompleted list to the completed list.
