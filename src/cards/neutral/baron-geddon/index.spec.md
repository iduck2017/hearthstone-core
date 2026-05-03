# Baron Geddon

## Rules

- **Cost / Stats**: 7 mana, 7/7, Legendary, Neutral
- **Effect**: "At the end of your turn, deal 2 damage to ALL other characters."
- **Trigger**: Activates at turn end if Baron Geddon is on the board.
- **Scope**: Deals 2 damage to all other characters (friendly minions, enemy minions, both heroes) except Baron Geddon itself.

## Implementation

### Core components

- `feat.ts` — `BaronGeddonFeatModel extends FeatModel`
  - `@useTurnEndEventConsumer(true)` — subscribes to turn end events
  - Collects all minions from both boards and both heroes
  - Excludes self from targets
  - Uses `damageSource.launch()` to deal 2 damage to each target

### Data flow

```
Turn ends
  → TurnEndPostEvent fires
  → BaronGeddonFeatModel listener executes
  → Check: game.currentPlayer === this.player (own turn only)
  → Collect targets: playerA.board.minions + playerB.board.minions + playerA.hero + playerB.hero
  → Exclude: this.entity (Baron Geddon itself)
  → For each target: damageSource.launch({ target, value: 2 })
  → Damage is processed normally (may trigger death, deathrattle, etc.)

Enemy turn starts
  → TurnEndEvent fires for enemy player
  → currentPlayer !== this.player → returns early, no effect
```

## Test scenarios

### Setup

```
playerA board : Baron Geddon (7/7)
playerA hero  : Warrior (30 HP)
playerB board : Wisp (1/1)
playerB hero  : Warrior (30 HP)
game.start() → playerA's turn (turn 1)
```

### Case 1 — deals damage on turn end

```
game.nextTurn() → playerB's turn (turn 2)
await sleep()

Assertion: playerA hero health = 28 (30 - 2)
Assertion: playerB hero health = 28 (30 - 2)
Assertion: playerB board minions = [] (Wisp died from 2 damage)
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `doomsayer/feat.ts` | TurnEndEvent system and BoardOnlyControllerModel pattern |
| `game.ts` | TurnEndPostEvent consumer |
