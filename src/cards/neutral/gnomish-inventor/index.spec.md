# Gnomish Inventor

## 1. Rules

- **Stats**: 4 cost 2/4 minion.
- **Battlecry**: Draw a card.
- **No target**: Battlecry runs automatically (player.drawCard()).

## 2. Implementation

- **GnomishInventorModel**: Minion 2/4, cost 4, with battlecry.
- **GnomishInventorBattlecryModel**: No selector; `_run` calls `player.drawCard()`.

## 3. Test scenario

**Setup**

- playerA hand: `gnomishInventor`
- playerA deck: `wisp` (one card)
- playerA board: empty
- playerA mana: 4

**Flow**

1. Play gnomishInventor, choose board index.
2. Assert playerA draws wisp into hand; deck empty.

### 3.1 check-initial-state

- playerA.hand contains gnomishInventor.
- playerA.deck contains wisp.
- playerA.board.cards.length === 0.

### 3.2 battlecry-draws-card

- gnomishInventor.launcher.launch() → select position.
- Assert playerA.hand.cards contains wisp.
- Assert playerA.deck.cards.length === 0.
