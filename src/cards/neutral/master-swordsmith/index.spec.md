# Master Swordsmith

## Rules

- **Cost / Stats**: 2 mana, 1/3, Rare, Neutral
- **Effect**: "At the end of your turn, give another random friendly minion +1 Attack."
- **Trigger**: Activates at turn end if Master Swordsmith is on the board.
- **Scope**: Randomly selects one other friendly minion (not itself) and gives it +1 Attack (permanent).

## Implementation

### Core components

- `feat.ts` — `MasterSmithFeatModel extends FeatModel`
  - `@useTurnEndEventConsumer()` — subscribes to turn end events
  - Filters friendly minions (excluding self)
  - Randomly selects one target minion
  - Adds `MasterSmithBuffModel` to target

- `buff.ts` — `MasterSmithBuffModel extends FeatModel`
  - `RoleAttackBuffModel(1)` as subfeat
  - Provides permanent +1 Attack to host minion

### Data flow

```
Turn ends
  → TurnEndPostEvent fires
  → MasterSmithFeatModel listener executes
  → Get friendly minions, exclude self
  → Randomly select one target
  → target.addFeat(new MasterSmithBuffModel())
  → MasterSmithBuffModel activates, applying +1 Attack via RoleAttackBuffModel
```

## Test scenarios

### Setup

```
playerA board : Master Swordsmith (1/3), Wisp A (1/1), Wisp B (1/1)
playerA hero  : Warrior (30 HP)
playerB board : empty
playerB hero  : Warrior (30 HP)
game.start() → playerA's turn (turn 1)
```

### Case 1 — gives +1 Attack to random friendly minion

```
game.nextTurn() → playerB's turn (turn 2)
await sleep()

Assertion: Master Swordsmith attack = 1 (not selected)
Assertion: Wisp A attack = 2 OR Wisp B attack = 2 (one was selected and received +1)
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `abusive-sergeant/buff.ts` | FeatModel with RoleAttackBuffModel pattern |
| `game.ts` | TurnEndEvent system |
