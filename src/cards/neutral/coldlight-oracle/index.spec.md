# Coldlight Oracle

## 1. Rules

- **Stats**: 3 cost, 2/2 minion, Neutral, Rare, Murloc.
- **Battlecry**: Both players draw 2 cards.
- **Edge cases**: Empty deck → `drawCard()` does nothing (no fatigue in this implementation).

## 2. Implementation

- **ColdlightOracleBattlecryModel**: extends `BattlecryModel<Model>`.
  - `getSelector()`: returns `undefined` (no target).
  - `@useBattlecryRunHook()` `handleRun()`: calls `player.drawCard()` twice, then `opponent.drawCard()` twice.
- **ColdlightOracleModel**: extends `MinionModel`, 3 cost, 2/2, Neutral, Rare, races = `[RaceType.MURLOC]`, feats = `[new ColdlightOracleBattlecryModel()]`.

## 3. Test scenario

**Setup**

- playerA hand: `coldlightOracle` (3 cost), mana 10
- playerA deck: `deckWisp1` (Wisp), `deckWisp2` (Wisp)
- playerB deck: `deckRaptor1` (Bloodfen Raptor), `deckRaptor2` (Bloodfen Raptor)
- playerA hand initial size: 1 (only the oracle)
- playerB hand initial size: 0

**Flow**

1. playerA plays `coldlightOracle`, selects board position 0.
2. Battlecry fires → playerA draws 2, playerB draws 2.

### 3.1 check-initial-state

- playerA.hand.cards contains `coldlightOracle`.
- playerA.deck.cards contains `deckWisp1` and `deckWisp2`.
- playerB.deck.cards contains `deckRaptor1` and `deckRaptor2`.

### 3.2 battlecry-both-players-draw-two

- `coldlightOracle.play()`, controller selects position 0.
- Assert `playerA.hand.cards` contains `deckWisp1` and `deckWisp2`.
- Assert `playerA.deck.cards.length === 0`.
- Assert `playerB.hand.cards` contains `deckRaptor1` and `deckRaptor2`.
- Assert `playerB.deck.cards.length === 0`.

## 4. Reference cards

- **Novice Engineer** (`src/cards/neutral/novice-engineer/battlecry.ts`): `player.drawCard()` pattern; Coldlight Oracle calls it twice per player and also draws for the opponent.
