# Murloc Tidehunter

## 1. Rules

- **Stats**: 2 cost 2/1 minion.
- **Battlecry**: Summon a 1/1 Murloc Scout to the right of this minion.
- **No target**: Battlecry runs automatically.

## 2. Implementation

- **MurlocTidehunterModel**: Minion 2/1, cost 2, with battlecry.
- **MurlocTidehunterBattlecryModel**: No selector; `_run` gets parent index, summons MurlocScoutModel at index + 1.
- **MurlocScoutModel**: Token 1/1, cost 0 (e.g. in derivatives/).

## 3. Test scenario

**Setup**

- playerA hand: `murlocTidehunter`
- playerA board: empty
- playerA mana: 2

**Flow**

1. Play murlocTidehunter, choose board index 0.
2. Assert murlocTidehunter on board; murlocScout summoned to its right; board has 2 minions.

### 3.1 check-initial-state

- playerA.board.cards.length === 0.
- playerA.hand contains murlocTidehunter.

### 3.2 play-murloc-tidehunter

- murlocTidehunter.play() → select position (boardIndex 0).
- Assert murlocTidehunter on board.
- Assert murlocScout summoned to right of murlocTidehunter.
- Assert playerA.board.minions.length === 2.
