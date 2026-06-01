# Spiteful Smith

## Rules

- **Cost / Stats**: 5 mana, 4/6, Common, Neutral
- **Effect**: "Your weapon has +2 Attack while this is damaged."
- **Condition**: Effect applies while this minion is on the board AND has taken damage (current health < max health).
- **Synergy**: Requires the hero to have an equipped weapon to benefit from the buff.

## Implementation

### Core components

- `feat.ts` — `SpitefulSmithFeatModel extends FeatModel`
  - `BoardOnlyControllerModel` sub-feat: disables feat when off-board.
  - `@useWeaponAttackDecorConsumer()` — subscribes to hero's weapon attack decor; adds AURA +2 when damaged.

### Data flow

```
Minion takes damage
  → health.current < health.maximum (damaged state)
  → feat is active (on board)
  → useWeaponAttackDecorConsumer subscribes to weapon.attack
  → consumer checks: if damaged → add +2 AURA to weapon attack

Minion healed to full
  → health.current === health.maximum (no longer damaged)
  → consumer re-runs: adds no buff → weapon attack decor reverts

Minion leaves board
  → BoardOnlyControllerModel deactivates feat
  → consumer returns [undefined, WeaponAttackDecor] → no buff
```

## Test scenarios

### Setup

```
playerA board : SpitefulSmith (4/6)
playerA hand  : FieryWarAxe, EarthenRingFarseer
playerA mana  : 10
playerB board : Wisp (1/1)
playerB hand  : Fireball (6 damage)
playerB mana  : 10
```

### Case 1 — equip weapon

```
weapon.deployer.launch()
await sleep()

Assert hero.weapon exists
Assert hero.weapon.attack.current === 3
```

### Case 2 — no buff while undamaged

```
Assert spitefulSmith.role.health.current === 6
Assert hero.weapon.attack.current === 3
```

### Case 3 — buff applies when damaged

```
game.nextTurn()                                      // playerB's turn, wisp wakes up

wisp.role.action.launch()
await sleep()
playerB.controller.selectTarget(spitefulSmith.role) // wisp (1 atk) attacks spitefulSmith
await sleep()

Assert spitefulSmith.role.health.current === 5
Assert hero.weapon.attack.current === 5              // +2 from SpitefulSmith enrage
```

### Case 4 — buff removed when healed to full

```
game.nextTurn()                                      // playerA's turn

earthenRingFarseer.deployer.launch()
await sleep()
playerA.controller.selectTarget(0)                  // board position
await sleep()
playerA.controller.selectTarget(spitefulSmith.role) // battlecry: restore 3 hp
await sleep()

Assert spitefulSmith.role.health.current === 6       // 5 + 3 = 6 (capped at max)
Assert hero.weapon.attack.current === 3              // buff removed
```

### Case 5 — no buff after SpitefulSmith dies

```
game.nextTurn()                                      // playerB's turn

fireball.deployer.launch()
await sleep()
playerB.controller.selectTarget(spitefulSmith.role) // 6 damage kills 6-hp SpitefulSmith
await sleep()

Assert playerA.board.minions does not contain spitefulSmith
Assert hero.weapon.attack.current === 3              // no buff
```

## Reference cards

| Reference | Used for |
|-----------|----------|
| `amani-berserker/feat.ts` | reactive health check in decor consumer |
| `stormwind-champion/feat.ts` | passive feat + BoardOnlyControllerModel structure |
| `weapon-attack.ts` | `useWeaponAttackDecorConsumer` pattern |
