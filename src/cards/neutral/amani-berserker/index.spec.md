# Amani Berserker

## 1. Rules

- **Stats**: 2 cost 2/3 minion.
- **Enrage**: While damaged (current health < maximum health), gains +3 Attack (effective 5).
- **Edge cases**: Healed to full → +3 lost; damaged again → +3 applies again.

## 2. Implementation

- **AmaniBerserkerModel**: Minion 2/3, cost 2, role features: [AmaniBerserkerFeatureModel].
- **AmaniBerserkerFeatureModel**: `@useRoleCurrentAttackDecorConsumer()` — reads `health.current` and `health.maximum`; when damaged, adds AURA +3 to attack decor; reactive re-evaluation removes buff automatically when health is restored.
- **Reference**: mirrors `AngryChickenFeatureModel` with value 3 instead of 5.

## 3. Test scenario

**Setup**

- playerA board: `amaniBerserker` (2/3)
- playerB board: `wisp` (1/1)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. `wisp.role.runAttack()`, select `amaniBerserker.role`.
3. amaniBerserker takes 1 damage (current 2, max 3) → enrage triggers.
4. wisp takes 2 damage and dies.

### 3.1 check-initial-state

- playerA.board contains amaniBerserker.
- playerB.board contains wisp.
- amaniBerserker.role.attack.current === 2 (no enrage).

### 3.2 enrage-gains-attack-while-damaged

- wisp attacks amaniBerserker.
- Assert amaniBerserker.role.health.current === 2, maximum === 3.
- Assert amaniBerserker.role.attack.current === 5.
- Assert wisp.disposer.isActived === true (dies from 2 damage).
