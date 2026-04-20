# Novice Engineer

## 1. Rules

- **Stats**: 2 cost 1/1 minion.
- **Battlecry**: Draw a card.
- **No target**: Battlecry runs automatically (player.drawCard()).

## 2. Implementation

- **NoviceEngineerModel**: Minion 1/1, cost 2, with battlecry.
- **NoviceEngineerBattlecryModel**: No selector; `_run` calls `player.drawCard()`.

## 3. Test scenario

**Setup**

- playerA hand: `noviceEngineer`
- playerA deck: `wisp` (Wisp, 1/1)
- playerA board: empty
- playerA mana: 2

**Flow**

1. Play noviceEngineer, choose board index.
2. Assert playerA draws wisp into hand; deck empty.

### 3.1 check-initial-state

- playerA.hand contains noviceEngineer.
- playerA.deck contains wisp.
- playerA.board.cards.length === 0.

### 3.2 battlecry-draws-card

- noviceEngineer.play() → select position.
- Assert playerA.hand.cards contains wisp.
- Assert playerA.deck.cards.length === 0.
