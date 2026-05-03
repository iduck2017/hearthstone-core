# Ragnaros the Firelord

## Rules

- **Cost / Stats**: 8 mana, 8/8, Legendary, Neutral, Elemental
- **Effect**: "Can't attack. At the end of your turn, deal 8 damage to a random enemy."
- **Trigger**: Activates at turn end if Ragnaros is on the board.
- **Scope**: Deals 8 damage to a random enemy character (enemy minions or enemy hero).
- **Restriction**: Ragnaros cannot attack (permanently asleep via sleepDecor).

## Implementation

### Core components

- `feat.ts` — `RagnarosTheFirelordFeatModel extends FeatModel`
  - `@useAsleepDecorConsumer()` — applies sleep decorator to force permanent sleep
  - `@useTurnEndEventConsumer()` — subscribes to turn end events
  - Collects all opponent minions and hero
  - Randomly selects one target
  - Uses `damageSource.launch()` to deal 8 damage

### Data flow

```
Ragnaros deployed
  → FeatModel initializes
  → @useAsleepDecorConsumer applies sleep to role.action
  
Turn ends
  → TurnEndPostEvent fires
  → RagnarosTheFirelordFeatModel listener executes
  → Check: game.currentPlayer === this.player (own turn only)
  → Collect targets: opponent.board.minions + opponent.hero
  → Randomly select one target
  → damageSource.launch({ target, value: 8 })
  
When Ragnaros leaves board
  → BoardOnlyControllerModel disables feat
  → Effect no longer triggers on turn end
```

## Test scenarios

### Setup

```
playerA board : Ragnaros the Firelord (8/8)
playerA hero  : Warrior (30 HP)
playerB board : Wisp (1/1)
playerB hero  : Warrior (30 HP)
game.start() → playerA's turn (turn 1)
```

### Case 1 — deals 8 damage to random enemy on turn end

```
game.nextTurn() → playerB's turn (turn 2)
await sleep()

Assertion: (Wisp destroyed) OR (playerB hero health === 22)
(One of the two targets received 8 damage)
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `baron-geddon/feat.ts` | TurnEndEvent and damageSource pattern |
| `charge.ts` | useAsleepDecorConsumer pattern |
