# Bloodmage Thalnos

## 1. Rules

- **Stats**: 2 cost, 1/1 minion, Neutral, Legendary.
- **Effect**: Spell Damage +1. While this minion is on the board, friendly spells deal 1 extra damage.
- **Deathrattle**: Draw a card when this minion dies.
- **Edge cases**:
  - Spell Damage aura is removed immediately when Thalnos leaves the board.
  - Deathrattle fires on death; empty deck → `drawCard()` does nothing.

## 2. Implementation

- **ThalnosDeathrattleModel**: extends `DeathrattleModel<Model>`.
  - `@useDeathrattleRunHook()` `handleRun()`: calls `player.drawCard()`.
- **ThalnossModel** (feat): extends `SpellDamageFeatModel(1)` — reuses the shared feat that wraps `BoardOnlyTagModel` + `usePlayerSpellDamageDecorConsumer` with value 1.
  - Alternatively, inline `KoboldGeomancerFeatModel` pattern: `BoardOnlyTagModel` + `@usePlayerSpellDamageDecorConsumer()` adding AURA +1.
- **BloodmageThalnossModel**: extends `MinionModel`, 2 cost, 1/1, Neutral, Legendary, feats = `[new SpellDamageFeatModel(1), new ThalnosDeathrattleModel()]`.

## 3. Test scenario

**Setup**

- playerA board: `bloodmageThalnos` (1/1)
- playerA hand: `fireball` (Fireball, 4 cost)
- playerA deck: `deckWisp` (Wisp)
- playerA mana: 10
- playerB board: `boulderfistOgre` (6/7) — survives base 6, dies to 7

**Flow**

1. playerA plays `fireball`, selects `boulderfistOgre.role`.
2. With Spell Damage +1 from Thalnos, Fireball deals 7 → boulderfistOgre dies.
3. Assert Spell Damage aura still active during spell (Thalnos still on board while fireball resolves).
4. bloodmageThalnos attacks boulderfistOgre's slot — instead, kill Thalnos via wisp attack on Thalnos.

*Revised flow to test both effects in one scenario:*

1. Assert Fireball kills boulderfistOgre (Spell Damage +1 active).
2. playerB wisp attacks bloodmageThalnos → both die (wisp 1/1 vs thalnos 1/1).
3. Deathrattle fires → playerA draws deckWisp into hand.

**Revised Setup**

- playerA board: `bloodmageThalnos` (1/1)
- playerA hand: `fireball` (Fireball, 4 cost)
- playerA deck: `deckWisp` (Wisp)
- playerA mana: 10
- playerB board: `boulderfistOgre` (6/7), `enemyWisp` (1/1)

### 3.1 check-initial-state

- playerA.board.cards contains `bloodmageThalnos`.
- playerA.hand.cards contains `fireball`.
- playerA.deck.cards contains `deckWisp`.
- playerB.board.cards contains `boulderfistOgre`.

### 3.2 spell-damage-boosts-fireball

- `fireball.play()`, controller selects `boulderfistOgre.role`.
- Assert `boulderfistOgre.disposer.isActived === true`.
- Assert `playerB.board.cards` does not contain `boulderfistOgre`.

### 3.3 deathrattle-draws-card-on-death

- `enemyWisp.role.runAttack()`, select `bloodmageThalnos.role`.
- Assert `bloodmageThalnos.disposer.isActived === true`.
- Assert `playerA.hand.cards` contains `deckWisp`.
- Assert `playerA.deck.cards.length === 0`.

## 4. Reference cards

- **Kobold Geomancer** (`src/cards/neutral/kobold-geomancer/feat.ts`): same Spell Damage +1 aura + `BoardOnlyTagModel` pattern.
- **SpellDamageFeatModel** (`src/feats/spell-damage-feat.ts`): reusable shared feat for Spell Damage +N; use `new SpellDamageFeatModel(1)` to avoid duplicating the feat class.
- **Loot Hoarder** (`src/cards/neutral/loot-hoarder/deathrattle.ts`): same deathrattle draw pattern.
