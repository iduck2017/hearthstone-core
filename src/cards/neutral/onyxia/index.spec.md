# Onyxia

## Rules

- **Cost / Stats**: 9 mana, 8/8, Legendary, Neutral, Dragon
- **Effect**: "Battlecry: Summon 1/1 Whelps until your side of the battlefield is full."
- **Trigger**: Activates when Onyxia is deployed via battlecry.
- **Scope**: Summons Whelp tokens (1/1 minions) until the friendly board reaches 7 minions total.

## Implementation

### Core components

- `battlecry.ts` — `OnyxiaBattlecryModel extends BattlecryModel<Model>`
  - `@useBattlecryLaunchHook()` — triggers on card deploy
  - Loops while board minions < 7
  - Summons a new `WhelpModel` at each iteration
  - Uses `whelp.deployer.summon(player, index)` to place each Whelp

### Data flow

```
Onyxia deployed
  → battlecry.launch()
  → handleRun() executes
  → while (board.minions.length < 7):
    → Create new WhelpModel
    → summon(player, board.minions.length)
    → Board size increases by 1
  → Loop exits when board reaches 7 minions
```

## Test scenarios

### Setup

```
playerA board : Wisp (1/1), Wisp (1/1), Wisp (1/1)
playerA hand  : Onyxia (9 mana)
playerA mana  : 10
playerB board : empty
playerB hero  : Warrior (30 HP)
game.start() → playerA's turn (turn 1)
```

### Case 1 — summons Whelps until board full

```
onyxia.deployer.launch()
playerA.controller.selectTarget(boardPosition)
await sleep()

Assertion: playerA.board.minions.length === 7
Assertion: playerA.board.minions[3] === onyxia
Assertion: playerA.board.minions[4..6] are all 1/1 (Whelps)
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `silver-hand-knight/battlecry.ts` | BattlecryModel pattern |
| `whelp/index.ts` | Whelp token minion |
