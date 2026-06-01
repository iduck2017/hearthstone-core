# Stormwind Champion

## 1. Rules

- **Stats**: 7 cost 6/6 minion.
- **Aura**: Your other minions have +1/+1.
- **Edge cases**: The buff does not apply to Stormwind Champion itself. The aura is reactive — when Stormwind Champion leaves the board the buffs disappear immediately.

## 2. Implementation

- **StormwindChampionFeatModel**: Uses `@useAllyRoleAttackDecorConsumer()` and `@useAllyRoleHealthDecorConsumer()` to subscribe to every allied minion's attack and health decors. In each handler, skip self by checking `decor.target === this.role?.attack` / `decor.target === this.role?.health`. Apply `BuffOperatorType.AURA` +1 to all other allies.
- **StormwindChampionModel**: 6/6 minion, cost 7, with `StormwindChampionFeatModel` and `BoardOnlyTagModel` in feats.

## 3. Test scenario

**Setup**

- playerA board: `stormwindChampion` (6/6), `wisp` (1/1)
- playerB board: `boulderfistOgre` (6/7), `enemyWisp` (1/1)

**Flow**

1. Assert wisp attack = 2 and health maximum = 2 (both buffed by aura).
2. Assert stormwindChampion attack = 6 and health maximum = 6 (no self-buff).
3. wisp attacks enemyWisp: wisp takes 1 damage (current 1, max 2), enemyWisp dies.
4. Assert wisp current health = 1, max health = 2 (still buffed, just damaged).
5. stormwindChampion attacks boulderfistOgre: champion dies, ogre survives.
6. Assert wisp attack = 1, health maximum = 1, health current = 1 (aura removed; current clamped to new max).

### 3.1 check-initial-state

- playerA.board contains stormwindChampion and wisp.
- wisp.role.attack.current === 2.
- wisp.role.health.maximum === 2.
- stormwindChampion.role.attack.current === 6.
- stormwindChampion.role.health.maximum === 6.

### 3.2 wisp-takes-damage-while-buffed

- wisp.role.runAttack(), select enemyWisp.role.
- Assert wisp.role.health.current === 1.
- Assert wisp.role.health.maximum === 2 (aura still active).

### 3.3 aura-removed-on-champion-death-health-stays-at-1

- stormwindChampion.role.runAttack(), select boulderfistOgre.role.
- Assert stormwindChampion.disposer.isActived === true.
- Assert wisp.role.attack.current === 1.
- Assert wisp.role.health.maximum === 1.
- Assert wisp.role.health.current === 1 (current does not exceed new max, wisp stays alive).
