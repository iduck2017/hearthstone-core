# Ironforge Rifleman

## 1. Rules

- **Stats**: 3 cost 2/2 minion.
- **Battlecry**: Deal 1 damage to a chosen enemy character (minion or hero).
- **Target**: Opponent's minions and opponent's hero (`opponent.board.minions` + `opponent.hero`).

## 2. Implementation

- **IronforgeRiflemanModel**: Minion 2/2, cost 3, with battlecry.
- **IronforgeRiflemanBattlecryModel**: Selector options = enemy minions and enemy hero; `_run` calls `target.receiveDamage({ value: 1 })`.

## 3. Test scenario

**Setup**

- playerA hand: `ironforgeRifleman`
- playerB board: `wisp` (1/1)
- playerA mana: 3

**Flow**

1. Play ironforgeRifleman, choose board index.
2. Choose target wisp.role.
3. Assert wisp takes 1 damage (health 0, dies).

### 3.1 check-initial-state

- playerB.board contains wisp, wisp.role.health.current === 1.
- playerA.hand contains ironforgeRifleman.

### 3.2 battlecry-deals-one-damage-to-enemy-minion

- ironforgeRifleman.play() → select position → select wisp.role.
- Assert wisp.role.health.current === 0, wisp.disposer.isActived === true.
