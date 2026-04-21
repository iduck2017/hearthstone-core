# Gurubashi Berserker

## 1. Rules

- **Stats**: 5 cost 2/7 minion.
- **Effect**: Whenever this minion takes damage, gain +3 Attack permanently.
- **Stacking**: Each damage event adds another +3, with no cap.
- **Edge cases**: Divine shield absorbs the hit — no damage dealt, no +3 gained.

## 2. Implementation

- **GurubashiBerserkerModel**: Minion 2/7, cost 5, role features: [GurubashiBerserkerFeatureModel].
- **GurubashiBerserkerFeatureModel**: `@useRoleDamageReceiveEventConsumer()` — on each post-event, calls `this.role.addFeature(new GurubashiBerserkerBuffModel())`.
- **GurubashiBerserkerBuffModel**: `@useRoleAttackDecorConsumer()` — adds COMMON +3 to attack decor. No expiry; persists for the rest of the game.
- **Reference**: buff pattern mirrors `AbusiveSergeantBuffModel` (COMMON buff via decor); event trigger uses `RoleDamageReceivePostEvent` which fires only after actual health loss (divine shield early-return bypasses it).

## 3. Test scenario

**Setup**

- playerA board: `gurubashiBerserker` (2/7)
- playerB board: `wisp` (1/1); hand: `elvenArcher` (1/1, Battlecry: deal 1 damage)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. `wisp.role.runAttack()`, select `gurubashiBerserker.role`.
3. gurubashiBerserker takes 1 combat damage → gains +3 Attack (effective 5); wisp dies from 2 damage.
4. playerB plays `elvenArcher`, battlecry selects `gurubashiBerserker.role`.
5. gurubashiBerserker takes 1 battlecry damage → gains another +3 Attack (effective 8).

### 3.1 check-initial-state

- playerA.board contains gurubashiBerserker.
- playerB.board contains wisp; playerB.hand contains elvenArcher.
- gurubashiBerserker.role.attack.current === 2 (no buff yet).

### 3.2 combat-hit-grants-plus-three-attack

- wisp attacks gurubashiBerserker.
- Assert gurubashiBerserker.role.health.current === 6.
- Assert gurubashiBerserker.role.attack.current === 5.
- Assert wisp.disposer.isActived === true.

### 3.3 battlecry-hit-stacks-another-plus-three

- playerB plays elvenArcher, battlecry targets gurubashiBerserker.role.
- Assert gurubashiBerserker.role.health.current === 5.
- Assert gurubashiBerserker.role.attack.current === 8.
