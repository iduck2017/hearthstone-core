# Silver Hand Knight

## 1. Rules

- **Stats**: 5 cost 4/4 minion.
- **Battlecry**: Summon a 2/2 Squire to the right of this minion.
- **No target**: Battlecry runs automatically.

## 2. Implementation

- **SilverHandKnightModel**: Minion 4/4, cost 5, with battlecry.
- **SilverHandKnightBattlecryModel**: No selector; `_run` gets parent index, summons SquireModel at index + 1.
- **SquireModel**: Token 2/2, cost 0 (e.g. in derivatives/).

## 3. Test scenario

**Setup**

- playerA hand: `silverHandKnight`
- playerA board: empty
- playerA mana: 5

**Flow**

1. Play silverHandKnight, choose board index 0.
2. Assert silverHandKnight on board; squire summoned to its right; board has 2 minions.

### 3.1 check-initial-state

- playerA.board.cards.length === 0.
- playerA.hand contains silverHandKnight.

### 3.2 play-silver-hand-knight

- silverHandKnight.play() → select position (boardIndex 0).
- Assert silverHandKnight on board.
- Assert squire summoned to right of silverHandKnight.
- Assert playerA.board.minions.length === 2.
