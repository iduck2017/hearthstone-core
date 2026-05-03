# Sea Giant

## Rules

- **Cost / Stats**: 10 mana, 8/8, Epic, Neutral
- **Effect**: "Costs (1) less for each other minion on the battlefield."
- **Scope**: Counts all minions on both boards (friendly and enemy), excluding the Sea Giant card itself.
- **Cost Calculation**: Base cost 10 - (number of minions on board) = final cost. Minimum cost is 0.

## Implementation

### Core components

- `feat.ts` — `SeaGiantFeatModel extends FeatModel`
  - `@usePlayerMinionCostDecorConsumer()` — subscribes to minion cost decor
  - Counts all minions on both boards (`game.playerA.board.minions + game.playerB.board.minions`)
  - Applies cost reduction via `decor.addBuff()`

### Data flow

```
FeatModel subscribes to player's hand minion costs via usePlayerMinionCostDecorConsumer
  → When cost is calculated for any friendly minion in hand:
    → Count all minions on board (playerA + playerB)
    → Apply -1 mana per minion via decor.addBuff()
    → Cost is reduced by total minion count
```

## Test scenarios

### Setup

```
playerA board : Murloc Raider (2/1)
playerA hand  : Sea Giant (10 mana cost)
playerB board : Wisp (1/1)
playerB mana  : 10
game.start() → playerA's turn (turn 1)
```

### Case 1 — cost reduced by minion count on board

```
Assertion: Sea Giant.cost.current === 8
(2 other minions on battlefield: Raider + Wisp, so 10 - 2 = 8)
```

### Case 2 — cost restored when all minions destroyed

```
playerA's Murloc Raider attacks playerB's Wisp
  → Raider (2/1) deals 2 damage to Wisp (1/1) → Wisp dies
  → Wisp (1/1) counter-attacks Raider (2/1) → Raider dies

Assertion: Sea Giant.cost.current === 10
(0 minions on battlefield, so 10 - 0 = 10)
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `pint-sized-summoner/feat.ts` | usePlayerMinionCostDecorConsumer pattern |
| `cost.ts` | CostDecor and addBuff pattern |
