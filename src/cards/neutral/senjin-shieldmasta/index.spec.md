# Sen'jin Shieldmasta

## 1. Rules

- **Stats**: 4 cost 3/5 minion.
- **Taunt**: opponent's attackers must target this minion (or another Taunt minion) instead of other targets.
- **Edge cases**: if multiple Taunt minions are on the board, the attacker may choose among them.

## 2. Implementation

- **SenjinShieldmastaModel**: Minion 3/5, cost 4, `TauntModel({ isActived: true })`, `races: []`.
- Taunt filtering is handled in `RoleAttackModel.getSelector()`: if any option has taunt active, options are filtered to only taunt targets.

## 3. Test scenario

**Setup**

- playerA board: `wisp` (1/1)
- playerB board: `shieldmasta` (3/5 Taunt) + `freeTarget` wisp (1/1, no taunt)

**Flow**

1. Verify `shieldmasta.role.taunt.isActived === true`.
2. `wisp.role.runAttack()` → selector must contain only `shieldmasta.role` (taunt forces it); `freeTarget` and playerB's hero are excluded.
3. Select `shieldmasta.role` → wisp dies (1 hp vs 3 atk), shieldmasta takes 1 damage (5→4 hp).

### 3.1 check-initial-state

- `shieldmasta.role.taunt.isActived === true`.
- `freeTarget.role.taunt.isActived === false`.
- `wisp.role.isAttackEnabled === true`.

### 3.2 taunt-forces-attacker-to-target-shieldmasta

- `wisp.role.runAttack()`: selector contains `shieldmasta.role` but NOT `freeTarget.role` and NOT `playerB.hero.role`.
- Select `shieldmasta.role`.
- Assert `wisp.disposer.isActived === true` (1 hp vs 3 atk → dead).
- Assert `shieldmasta.role.health.current === 4` (took 1 damage from wisp).
- Assert `shieldmasta.disposer.isActived === false`.

## 4. Reference cards

- **Goldshine Footman** (`src/cards/neutral/goldshine-footman/index.ts`): same Taunt pattern, 1/4.
- **Lord of the Arena** (`src/cards/neutral/lord-of-the-arena/index.ts`): same pattern, 6/5.
