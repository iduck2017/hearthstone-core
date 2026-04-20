# Elven Archer

## 1. Rules

- **Stats**: 1 cost 1/1 minion.
- **Battlecry**: Deal 1 damage to a chosen enemy character (minion or hero).
- **Target**: Opponent's minions and opponent's hero.

## 2. Implementation

- **ElvenArcherModel**: Minion 1/1, cost 1, with battlecry.
- **ElvenArcherBattlecryModel**: Selector options = enemy minions and enemy hero; `_run` calls `target.receiveDamage({ value: 1 })`.

## 3. Test scenario

**Setup**

- playerA hand: `elvenArcher`
- playerB board: `wisp` (1/1)
- playerA mana: 1

**Flow**

1. Play elvenArcher, choose board index.
2. Choose target wisp.role.
3. Assert wisp takes 1 damage (health 0, dies); elvenArcher on board, wisp removed.

### 3.1 check-initial-state

- wisp.role.health.current === 1, elvenArcher in hand, elvenArcher.isPlayable === true.

### 3.2 play-elven-archer

- elvenArcher.play() → select position → select wisp.role.
- Assert playerB.board.minions.length === 0, wisp.disposer.isActived === true, wisp.role.health.current === 0.
