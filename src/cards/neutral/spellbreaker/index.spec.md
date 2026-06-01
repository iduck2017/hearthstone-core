# Spellbreaker

## 1. Rules

- **Stats**: 4 cost 4/3 minion.
- **Battlecry**: Silence a minion.
- **Target**: Any minion on either board, excluding Spellbreaker itself.
- **Silence effect**: Calls `target.minion.silence()` — disables all feats on the card and all keyword rules on the role (taunt, divineShield, charge, rush, stealth).

## 2. Implementation

- **SpellbreakerModel**: Minion 4/3, cost 4, with battlecry (`SpellbreakerBattlecryModel`).
- **SpellbreakerBattlecryModel** extends `BattlecryModel<RoleModel>`:
  - `@useBattlecrySelectHook` — options = all minions on both boards excluding self, mapped to `.role`.
  - `@useBattlecryLaunchHook` — calls `target.minion?.silence()`.

**Data flow**:
```
deployer.launch()
  → select board position
  → battlecry.getTargets() → all minions on both boards excluding self
  → controller.fetchTarget(options) → user picks a RoleModel
  → battlecry.launch(target)
      → target.minion?.silence()
          → feats.forEach(feat => feat.disable())
          → role.taunt / divineShield / charge / rush / stealth → disable()
```

## 3. Test scenario

Sunwalker (4/5, taunt + divine shield) is buffed +1/+1 by Shattered Sun Cleric, then silenced by Spellbreaker. The test verifies all three effects are stripped in one flow.

**Setup**

- playerA hand: `shatteredSunCleric`, `spellbreaker`
- playerA board: `sunwalker` (4/5, taunt, divine shield)
- playerA mana: 7

### 3.1 check-initial-state

- `sunwalker.role.attack.current === 4`.
- `sunwalker.role.health.maximum === 5`.
- `sunwalker.role.taunt.isActived === true`.
- `sunwalker.role.divineShield.isActived === true`.

### 3.2 buff-sunwalker

- `shatteredSunCleric.deployer.launch()` → `selectTarget(1)` → `selectTarget(sunwalker.role)`.
- `sunwalker.role.attack.current === 5`.
- `sunwalker.role.health.maximum === 6`.

### 3.3 silence-sunwalker

- `spellbreaker.deployer.launch()` → `selectTarget(2)` → `selectTarget(sunwalker.role)`.
- `sunwalker.role.taunt.isActived === false`.
- `sunwalker.role.divineShield.isActived === false`.
- `sunwalker.role.attack.current === 4` (buff feat disabled, back to base).
- `sunwalker.role.health.maximum === 5` (buff feat disabled, back to base).

## 4. Reference cards

| Reference | Used for |
|-----------|----------|
| [cards/neutral/ancient-brewmaster/battlecry.ts](../ancient-brewmaster/battlecry.ts) | Same targeted battlecry pattern, same self-exclusion logic |
| [cards/minion.ts](../../minion.ts) | `silence()` implementation |
