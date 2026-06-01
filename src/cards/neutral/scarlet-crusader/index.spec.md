# Scarlet Crusader

## 1. Rules

- **Stats**: 3 cost 3/1 minion.
- **Divine Shield**: the first instance of damage is completely absorbed; the shield is then removed. The minion's health is unchanged by the absorbed hit.
- **Edge cases**: with only 1 health, the crusader survives any single attack while shielded, then dies to any subsequent hit.

## 2. Implementation

- **ScarletCrusaderModel**: Minion 3/1, cost 3, `DivineShieldModel({ isActived: true })`, `races: []`.
- Divine Shield consumption is handled in `RoleModel.receiveDamage()`: if shield is active, consume it and skip the damage.

## 3. Test scenario

**Setup**

- playerA board: `wispA` (1/1) + `wispB` (1/1)
- playerB board: `crusader` (3/1 Divine Shield)

**Flow**

1. Verify `crusader.role.divineShield.isActived === true`.
2. `wispA.role.runAttack()` → target `crusader.role` → divine shield absorbs the hit; crusader survives at 1 hp, shield gone. wispA takes 3 damage and dies.
3. `wispB.role.runAttack()` → target `crusader.role` → no shield; crusader takes 1 damage and dies.

### 3.1 check-initial-state

- `crusader.role.divineShield.isActived === true`.
- `crusader.role.health.current === 1`.

### 3.2 divine-shield-absorbs-first-hit

- `wispA.role.runAttack()`, select `crusader.role`.
- Assert `crusader.role.divineShield.isActived === false`.
- Assert `crusader.role.health.current === 1` (no damage taken).
- Assert `crusader.disposer.isActived === false`.
- Assert `wispA.disposer.isActived === true` (took 3 damage).

### 3.3 dies-after-shield-broken

- `wispB.role.runAttack()`, select `crusader.role`.
- Assert `crusader.role.health.current === 0`.
- Assert `crusader.disposer.isActived === true`.

## 4. Reference cards

- **Argent Squire** (`src/cards/neutral/argent-squire/index.ts`): same Divine Shield pattern, 1/1.
- **Silvermoon Guardian** (`src/cards/neutral/silvermoon-guardian/index.ts`): same pattern, 3/4.
