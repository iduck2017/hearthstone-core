# Razorfen Hunter

## 1. Rules

- **Stats**: 3 cost 2/3 minion.
- **Battlecry**: Summon a 1/1 Boar to the right of this minion.
- **No target**: Battlecry runs automatically.

## 2. Implementation

- **RazorfenHunterModel**: Minion 2/3, cost 3, with battlecry.
- **RazorfenHunterBattlecryModel**: No selector; `_run` gets parent index, summons BoarModel at index + 1.
- **BoarModel**: Token 1/1, cost 0 (e.g. in derivatives/).

## 3. Test scenario

**Setup**

- playerA hand: `razorfenHunter`
- playerA board: empty
- playerA mana: 3

**Flow**

1. Play razorfenHunter, choose board index 0.
2. Assert razorfenHunter on board; boar summoned to its right; board has 2 minions.

### 3.1 check-initial-state

- playerA.board.cards.length === 0.
- playerA.hand contains razorfenHunter.

### 3.2 play-razorfen-hunter

- razorfenHunter.play() → select position (boardIndex 0).
- Assert razorfenHunter on board.
- Assert boar summoned to right of razorfenHunter.
- Assert playerA.board.minions.length === 2.
