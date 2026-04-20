# Loot Hoarder

## 1. Rules

- **Stats**: 2 cost 2/1 minion.
- **Deathrattle**: When this minion dies, its controller draws 1 card (`player.drawCard()`).
- **Edge cases**: Deck empty → `drawCard()` does nothing.

## 2. Implementation

- **LootHoarderModel**: Minion 2/1, cost 2, with deathrattle.
- **LootHoarderDeathrattleModel**: In `_run`, get `player` and call `player.drawCard()`.

## 3. Test scenario

**Setup**

- playerA board: `lootHoarder` (2/1)
- playerA deck: `deckWisp` (Wisp, 1/1)
- playerA hand: empty
- playerB board: `wisp` (1/1)

**Flow**

1. lootHoarder attacks wisp; both die.
2. Deathrattle runs → playerA draws deckWisp into hand.

### 3.1 check-initial-state

- playerA.board contains lootHoarder.
- playerA.deck contains deckWisp.
- playerA.hand.cards.length === 0.

### 3.2 deathrattle-draws-top-card-on-death

- lootHoarder.role.runAttack(), choose target wisp.role.
- Assert lootHoarder.disposer.isActived === true.
- Assert playerA.board.minions.length === 0.
- Assert playerA.hand.cards contains deckWisp.
- Assert playerA.deck.cards.length === 0.
