# Kobold Geomancer

## 1. Rules

- **Stats**: 2 cost, 2/2 minion, Neutral, Common.
- **Effect**: Spell Damage +1. While this minion is on the board, all friendly spells deal 1 extra damage.
- **Aura**: Active only while on the board (BoardOnlyTagModel). Removed immediately when it dies.

## 2. Implementation

- **KoboldGeomancerFeatModel**: extends `FeatModel`.
  - `@useRoute(() => MinionModel)` → `role` getter.
  - `@useChild()` `BoardOnlyTagModel` — disables feat when not on board.
  - `@usePlayerSpellDamageDecorConsumer()` `_onSpellDamageDecor(decor)`:
    - Calls `decor.addBuff({ value: 1, type: BuffOperatorType.AURA, source: this })`.
- **KoboldGeomancerModel**: extends `MinionModel`, 2 cost, 2/2, Neutral, Common, feats = `[new KoboldGeomancerFeatModel()]`.

### SpellModel.launcher.launch() fix

`removeCard` must move to after effects resolve (alongside `disposeCard`), so the spell stays in hand during `handleRun` and the Spell Damage aura remains active:

```
consumeMana()
→ launcher.next() (card still in hand → _damage = 7)
→ removeCard() + disposeCard()
```

## 3. Test scenario

**Setup**

- playerA board: `koboldGeomancer` (2/2)
- playerA hand: `fireball` (Fireball, 4 cost)
- playerA mana: 10
- playerB board: `boulderfistOgre` (6/7) — survives 6 damage, dies to 7

**Flow**

1. playerA plays `fireball`, selects `boulderfistOgre.role`.
2. With Spell Damage +1, Fireball deals 7 damage → boulderfistOgre dies (7 - 7 = 0).

### 3.1 check-initial-state

- playerA.board.cards contains `koboldGeomancer`.
- playerA.hand.cards contains `fireball`.
- playerB.board.cards contains `boulderfistOgre`.

### 3.2 spell-damage-boosts-fireball

- `fireball.launcher.launch()`, controller selects `boulderfistOgre.role`.
- Assert `boulderfistOgre.disposer.isActived === true`.
- Assert `playerB.board.cards.length === 0`.

## 4. Reference cards

- **Grimscale Oracle** (`src/cards/neutral/grimscale-oracle/feat.ts`): same aura + `BoardOnlyTagModel` pattern; replace `useAllyRoleAttackDecorConsumer` with `usePlayerSpellDamageDecorConsumer`.
- **SpellDamageDecor** (`src/decors/spell-damage.ts`): `usePlayerSpellDamageDecorConsumer` + `BuffOperatorType.AURA`.
