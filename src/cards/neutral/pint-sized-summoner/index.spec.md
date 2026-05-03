# Pint-Sized Summoner

## Rules

- **Cost / Stats**: 2 mana, 2/2, Rare, Neutral
- **Effect**: "The first minion you play each turn costs (1) less."
- **Condition**: Effect is only active while Pint-Sized Summoner is on the board.
- **Reset**: The discount resets at the end of each turn (available again next turn).
- **Floor**: Minion cost cannot go below 0.

## Implementation

### Core components

- `feat.ts` — `PintSizedSummonerFeatModel extends FeatModel`
  - `BoardOnlyControllerModel` sub-feat: disables the feat when off-board.
  - `@useState() _isMinionPlayed: boolean` — tracks whether the first minion has been played this turn.
  - `@useMemo() isMinionPlayed` — reactive getter over `_isMinionPlayed`.
  - `@usePlayerMinionCostDecorConsumer()` — subscribes to all friendly minion costs; adds AURA −1 when `!isMinionPlayed`.
  - `@usePlayerCardPlay()` — when a minion is played, sets `_isMinionPlayed = true`.
  - `@useTurnEndEventConsumer()` — resets `_isMinionPlayed = false` each turn end.

### Data flow

```
Turn starts
  → _isMinionPlayed = false (from previous turn end reset)
  → usePlayerMinionCostDecorConsumer active → all friendly hand minions cost −1

Player plays first minion
  → CardPlayPostEvent fires (from minion-deployer finishLaunch)
  → _onCardPlay: event.card instanceof MinionModel → _isMinionPlayed = true
  → isMinionPlayed getter invalidates
  → consumer re-runs: adds no buff → minion costs revert to base

Turn ends
  → _isMinionPlayed = false (reset for next turn)

Pint-Sized Summoner leaves board
  → BoardOnlyControllerModel disables feat
  → isActived = false → consumer returns [undefined, CostDecor] → no buff
```

## Test scenarios

### Setup

```
playerA board : PintSizedSummoner (2/2)
playerA hand  : IronfurGrizzly × 2  (base cost 3)
playerA mana  : ManaModel({ current: 10, maximum: 10 })
playerB board : IronfurGrizzly  (3/3/3 Taunt) ← used to attack pintSized in Case 4
```

### Case 1 — discount applies to minions in hand

```
Assert grizzly1.cost.current === 2
Assert grizzly2.cost.current === 2
```

### Case 2 — discount consumed after first minion played

```
grizzly1.deployer.launch()
await sleep()
playerA.controller.selectTarget(0)   // board position
await sleep()

Assert grizzly2.cost.current === 3   // no more discount
```

### Case 3 — discount resets after turn end

```
game.nextTurn()   // playerB's turn
game.nextTurn()   // back to playerA

Assert grizzly2.cost.current === 2   // discount active again
```

### Case 4 — no discount after Pint-Sized Summoner dies

```
game.nextTurn()   // playerB's turn — grizzlyB wakes up

grizzlyB.role.action.launch()
await sleep()
playerB.controller.selectTarget(pintSized.role)   // grizzlyB (3atk) kills pintSized (2hp)
await sleep()

game.nextTurn()   // playerA's turn

Assert grizzly2.cost.current === 3   // pintSized dead, no discount
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `gadgetzan-auctioneer/feat.ts` | `usePlayerCardPlay` consumer pattern |
| `stormwind-champion/feat.ts` | passive feat + BoardOnlyControllerModel structure |
| `amani-berserker/feat.ts` | reactive condition check inside decor consumer |
| `abusive-sergeant/buff.ts` | `@useTurnEndEventConsumer` reset pattern |
