# Stormpike Commando

## 1. Rules

- **Stats**: 5 cost 4/2 minion.
- **Battlecry**: Deal 2 damage to a chosen enemy character (minion or hero).
- **Target**: Opponent's minions and opponent's hero.

## 2. Implementation

- **StormpikeCommandoModel**: Minion 4/2, cost 5, with battlecry.
- **StormpikeCommandoBattlecryModel**: Selector options = enemy minions and enemy hero; `_run` calls `target.receiveDamage({ value: 2 })`.

## 3. Test scenario

**Setup**

- playerA hand: `stormpikeCommando`
- playerB board: `wisp` (1/1)
- playerA mana: 5

**Flow**

1. Play stormpikeCommando, choose board index.
2. Choose target wisp.role.
3. Assert wisp takes 2 damage (health -1, dies).

### 3.1 check-initial-state

- playerB.board contains wisp, wisp.role.health.current === 1.
- playerA.hand contains stormpikeCommando.

### 3.2 battlecry-deals-two-damage-to-enemy-minion

- stormpikeCommando.launcher.launch() → select position → select wisp.role.
- Assert wisp.role.health.current === -1 (or 0), wisp.disposer.isActived === true.
