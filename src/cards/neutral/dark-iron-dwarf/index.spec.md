# Dark Iron Dwarf

## 1. Rules

- **Stats**: 4 cost 4/4 minion.
- **Battlecry**: Give a friendly minion +2 Attack until end of turn.
- **Target**: Friendly minions only (selector from `player.board.minions`).
- **Duration**: Buff is removed on turn end (via `TurnEndEvent` and `deactive()`).

## 2. Implementation

- **DarkIronDwarfModel**: Minion 4/4, cost 4, with battlecry.
- **DarkIronDwarfBattlecryModel**: Selector options = friendly minions; on run, `target.container.addFeature(new DarkIronDwarfBuffModel())`.
- **DarkIronDwarfBuffModel**: `@useRoleAttackBuff(2)`, `@useTurnEndEventListener` → `deactive()` so buff expires at turn end.

## 3. Test scenario

**Setup**

- playerA hand: `darkIronDwarf`
- playerA board: `wisp` (1/1)
- playerA mana: 5 (so dwarf is playable)

**Flow**

1. Play darkIronDwarf, choose board index, choose target wisp.
2. Assert wisp has +2 attack (current === 3).
3. `game.nextTurn()`.
4. Assert wisp attack back to 1 (buff removed).

### 3.1 check-initial-state

- playerA.board contains wisp, wisp.role.attack.current === 1.
- playerA.hand contains darkIronDwarf, mana sufficient.

### 3.2 battlecry-gives-friendly-minion-plus-two-attack-until-turn-end

- darkIronDwarf.play() → select position → select wisp.role.
- Assert wisp.role.attack.current === 3.
- game.nextTurn().
- Assert wisp.role.attack.current === 1.
