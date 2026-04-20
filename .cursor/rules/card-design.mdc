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

1. Write the technical spec first (see e.g. loot-hoarder’s index.spec.md). It must include:
   - **Rules**: Card name, cost/stats, effect description, edge cases.
   - **Implementation**: Core components, data flow (trigger → execute → result).
   - **Test scenario**: Setup, flow, and per-case assertions.
   - **Reference cards**: Reference cards and reference effects the design builds on.
2. Implement the example card and tests according to the spec.
3. Update the implemented list in todo.md.
