# Doomsayer

## Rules

- **Cost / Stats**: 2 mana, 0/7, Rare, Neutral
- **Effect**: "At the start of your turn, destroy ALL minions."
- **Trigger**: Activates at turn start if Doomsayer is on the board.
- **Scope**: Destroys all minions on both boards (friendly and enemy).

## Implementation

### Core components

- `feat.ts` — `DoomsayerFeatModel extends FeatModel`
  - `@useTurnStartEventConsumer()` — subscribes to turn start events
  - Destroys all minions on both boards when triggered

### Data flow

```
Turn starts
  → TurnStartPostEvent fires
  → DoomsayerFeatModel listener executes
  → Check: game.currentPlayer === this.player (only own turn)
  → Destroy all minions (game.playerA.board.minions + game.playerB.board.minions)
  → Doomsayer itself is destroyed as part of the sweep

Enemy turn starts
  → TurnStartPostEvent fires
  → currentPlayer !== this.player → returns early, no effect
```

## Test scenarios

### Setup

```
playerA board : Wisp (1/1)
playerA hand  : Doomsayer (0/7)
playerA mana  : 10
playerB board : Murloc Raider (2/1)
playerB hand  : empty
playerB mana  : 10
game.start() → playerA's turn (turn 1)
```

### Case 1 — deploy doomsayer

```
doomsayer.deployer.launch()
await sleep()

Assert playerA.board.minions contains doomsayer and wisp
```

### Case 2 — no trigger on enemy turn

```
game.nextTurn()                                // playerB's turn (turn 2)
await sleep()

Assert playerA.board.minions contains doomsayer and wisp
Assert playerB.board.minions contains raider
```

### Case 3 — destroys all minions on own turn start

```
game.nextTurn()                                // playerA's turn (turn 3), TurnStartEvent fires
await sleep()

Assert playerA.board.minions is empty          // doomsayer destroyed
Assert playerB.board.minions is empty          // wisp and raider destroyed
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `spiteful-smith/feat.ts` | FeatModel + BoardOnlyControllerModel pattern |
| `game.ts` | TurnStartEvent system |
