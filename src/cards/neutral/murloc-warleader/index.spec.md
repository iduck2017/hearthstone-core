# Murloc Warleader

## 1. Rules

- **Stats**: 3 cost, 3/3 minion, Neutral, Epic, Murloc.
- **Aura**: Your other Murlocs have +2 Attack and +1 Health.
- **Edge cases**:
  - Buff applies only to other friendly Murlocs; non-Murloc allies are unaffected.
  - Warleader itself is not buffed (skip self in both attack and health handlers).
  - Aura is reactive — disappears immediately when Warleader leaves the board.
  - Health buff increases the maximum; current health is clamped to the new maximum when the aura is removed.

## 2. Implementation

- **MurlocWarleaderFeatModel**: extends `FeatModel`.
  - `@useRoute(() => MinionModel)` → `role` getter.
  - `@useChild()` `BoardOnlyTagModel` — disables feat when not on board.
  - `@useAllyRoleAttackDecorConsumer()` `_onAllyAttackDecor(decor)`:
    - Skip self: `if (decor.target === this.role?.attack) return`.
    - Skip non-Murlocs: `if (!decor.target.minion?.races.includes(RaceType.MURLOC)) return`.
    - `decor.addBuff({ value: 2, type: BuffOperatorType.AURA, source: this })`.
  - `@useAllyRoleHealthDecorConsumer()` `_onAllyHealthDecor(decor)`:
    - Skip self: `if (decor.target === this.role?.health) return`.
    - Skip non-Murlocs: `if (!decor.target.minion?.races.includes(RaceType.MURLOC)) return`.
    - `decor.addBuff({ value: 1, type: BuffOperatorType.AURA, source: this })`.
- **MurlocWarleaderModel**: extends `MinionModel`, 3 cost, 3/3, Neutral, Epic, races = `[RaceType.MURLOC]`, feats = `[new MurlocWarleaderFeatModel()]`.

## 3. Test scenario

**Setup**

- playerA board: `murlocWarleader` (3/3 Murloc), `murlocRaider` (2/1 Murloc), `wisp` (1/1)
- playerB board: `boulderfistOgre` (6/7)

**Flow**

1. Assert murlocRaider gains +2 Attack and +1 Health from aura (attack = 4, health max = 2).
2. Assert wisp is not buffed (attack = 1, health max = 1) — not a Murloc.
3. Assert murlocWarleader is not self-buffed (attack = 3, health max = 3).
4. murlocWarleader attacks boulderfistOgre → warleader dies (takes 6 damage, has 3 HP).
5. Assert murlocRaider attack drops back to 2, health max drops back to 1.

### 3.1 check-initial-state

- playerA.board.cards contains `murlocWarleader`, `murlocRaider`, and `wisp`.
- `murlocRaider.role.attack.current === 4` (2 base + 2 aura).
- `murlocRaider.role.health.maximum === 2` (1 base + 1 aura).
- `wisp.role.attack.current === 1` (no buff — not a Murloc).
- `wisp.role.health.maximum === 1` (no buff — not a Murloc).
- `murlocWarleader.role.attack.current === 3` (no self-buff).
- `murlocWarleader.role.health.maximum === 3` (no self-buff).

### 3.2 aura-removed-when-warleader-dies

- `murlocWarleader.role.runAttack()`, select `boulderfistOgre.role`.
- Assert `murlocWarleader.disposer.isActived === true`.
- Assert `murlocRaider.role.attack.current === 2` (aura gone).
- Assert `murlocRaider.role.health.maximum === 1` (aura gone, current clamped to 1).

## 4. Reference cards

- **Grimscale Oracle** (`src/cards/neutral/grimscale-oracle/feat.ts`): same Murloc-filtered aura + `BoardOnlyTagModel` pattern with `useAllyRoleAttackDecorConsumer`.
- **Stormwind Champion** (`src/cards/neutral/stormwind-champion/feat.ts`): pattern for combining both `useAllyRoleAttackDecorConsumer` and `useAllyRoleHealthDecorConsumer` in one feat.
