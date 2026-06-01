# Southsea Captain

## 1. Rules

- **Stats**: 3 cost, 3/3 minion, Neutral, Epic, Pirate.
- **Aura**: Your other Pirates have +1/+1.
- **Edge cases**:
  - Buff applies only to other friendly Pirates; non-Pirate allies are unaffected.
  - Captain itself is not buffed (skip self in both attack and health handlers).
  - Aura is reactive — disappears immediately when Captain leaves the board.
  - Health buff increases the maximum; current health is clamped when the aura is removed.

## 2. Implementation

- **SouthseaCaptainFeatModel**: extends `FeatModel`.
  - `@useRoute(() => MinionModel)` → `role` getter.
  - `@useChild()` `BoardOnlyTagModel` — disables feat when not on board.
  - `@useAllyRoleAttackDecorConsumer()` `_onAllyAttackDecor(decor)`:
    - Skip self: `if (decor.target === this.role?.attack) return`.
    - Skip non-Pirates: `if (!decor.target.minion?.races.includes(RaceType.PIRATE)) return`.
    - `decor.addBuff({ value: 1, type: BuffOperatorType.AURA, source: this })`.
  - `@useAllyRoleHealthDecorConsumer()` `_onAllyHealthDecor(decor)`:
    - Skip self: `if (decor.target === this.role?.health) return`.
    - Skip non-Pirates: `if (!decor.target.minion?.races.includes(RaceType.PIRATE)) return`.
    - `decor.addBuff({ value: 1, type: BuffOperatorType.AURA, source: this })`.
- **SouthseaCaptainModel**: extends `MinionModel`, 3 cost, 3/2, Neutral, Epic, races = `[RaceType.PIRATE]`, feats = `[new SouthseaCaptainFeatModel()]`.

## 3. Test scenario

**Setup**

- playerA board: `southseaCaptain` (3/3 Pirate), `southseaCaptain2` (second instance, 3/3 Pirate)
- playerB board: `boulderfistOgre` (6/7)

> Note: No simple Pirate ally exists yet (Southsea Deckhand requires weapon support). Two Captain instances serve as mutual Pirate allies — each buffs the other but not itself.

**Flow**

1. Assert `southseaCaptain2` gains +1 Attack and +1 Health from `southseaCaptain`'s aura (attack = 4, health max = 3). (It also receives its own aura's buff, but self-buff is excluded, so only the other Captain's aura applies.)
2. Assert `southseaCaptain` is buffed by `southseaCaptain2`'s aura (attack = 4, health max = 3) — each buffs the other.
3. `southseaCaptain` attacks `boulderfistOgre` → captain dies (4 effective HP, takes 6).
4. Assert `southseaCaptain2` loses `southseaCaptain`'s aura contribution → attack drops back to 3, health max drops back to 2.

### 3.1 check-initial-state

- playerA.board.cards contains `southseaCaptain` and `southseaCaptain2`.
- `southseaCaptain.role.attack.current === 4` (3 base + 1 from southseaCaptain2's aura).
- `southseaCaptain.role.health.maximum === 4` (3 base + 1 from southseaCaptain2's aura).
- `southseaCaptain2.role.attack.current === 4` (3 base + 1 from southseaCaptain's aura).
- `southseaCaptain2.role.health.maximum === 4` (3 base + 1 from southseaCaptain's aura).

### 3.2 aura-removed-when-captain-dies

- `southseaCaptain.role.runAttack()`, select `boulderfistOgre.role`.
- Assert `southseaCaptain.disposer.isActived === true`.
- Assert `southseaCaptain2.role.attack.current === 3` (only own aura gone with self, no self-buff).
- Assert `southseaCaptain2.role.health.maximum === 3` (aura gone, back to base).

## 4. Reference cards

- **Grimscale Oracle** (`src/cards/neutral/grimscale-oracle/feat.ts`): same race-filtered aura + `BoardOnlyTagModel` pattern; replace `RaceType.MURLOC` with `RaceType.PIRATE`.
- **Stormwind Champion** (`src/cards/neutral/stormwind-champion/feat.ts`): pattern for combining both `useAllyRoleAttackDecorConsumer` and `useAllyRoleHealthDecorConsumer` in one feat.
