# Hearthstone Core — Implementation Reference

Quick-reference guide for implementing cards. Keep this file open when writing specs or code.

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Core Entities](#2-core-entities)
3. [Feat System](#3-feat-system)
4. [Keyword Rules (RoleModel)](#4-keyword-rules-rolemodel)
5. [Decor System (Reactive Buffs)](#5-decor-system-reactive-buffs)
6. [Event System](#6-event-system)
7. [Disposer System](#7-disposer-system)
8. [Test Harness Patterns](#8-test-harness-patterns)
9. [File Structure for a New Card](#9-file-structure-for-a-new-card)
10. [Enums Quick Reference](#10-enums-quick-reference)
11. [Reference Card Index](#11-reference-card-index)
12. [Runtime Model Tree](#12-runtime-model-tree)
13. [Key Flows](#13-key-flows)

---

## 1. Project Architecture

```
src/
├── entities/
│   ├── game.ts           — GameModel
│   ├── player.ts         — PlayerModel
│   ├── board.ts          — BoardModel
│   ├── hand.ts           — HandModel
│   ├── deck.ts           — DeckModel
│   ├── graveyard.ts      — GraveyardModel
│   ├── workspace.ts      — WorkspaceModel
│   └── role.ts           — RoleModel + RoleAttackReceiveEvent/PrevEvent + consumer helpers
├── cards/
│   ├── index.ts          — CardModel (abstract base)
│   ├── minion.ts         — MinionModel
│   ├── spell.ts          — SpellModel
│   ├── weapon.ts         — WeaponModel
│   ├── neutral/<name>/   — one folder per card
│   ├── mage/<name>/
│   ├── warrior/<name>/
│   └── derivatives/      — token minions
├── feats/
│   ├── index.ts          — FeatModel, SubFeatModel, RoleFeatIntf interface, FeatIntf interface
│   ├── battlecry.ts      — BattlecryModel<T>, registries, hook decorators
│   ├── deathrattle.ts    — DeathrattleModel, registry, hook decorator
│   ├── spell-effect.ts   — SpellEffectModel<T>, registries, hook decorators
│   ├── role-attack-buff.ts  — RoleAttackBuffModel (SubFeatModel)
│   ├── role-health-buff.ts  — RoleHealthBuffModel (SubFeatModel)
│   ├── spell-damage-feat.ts — SpellDamageFeatModel
│   └── board-only-controller.ts — BoardOnlyControllerModel (SubFeatModel, disables feat off-board)
├── rules/
│   ├── role-attack.ts    — RoleAttackModel + RoleAttackEvent/PrevEvent + consumer helpers
│   ├── role-health.ts    — RoleHealthModel + RoleDamageReceiveEvent/PrevEvent + consumer helpers
│   ├── role-action.ts    — RoleActionModel + AsleepDecor + useAsleepDecorConsumer
│   ├── taunt.ts
│   ├── charge.ts         — ChargeModel (extends FeatModel)
│   ├── rush.ts           — RushModel (extends FeatModel)
│   ├── stealth.ts
│   ├── divine-shield.ts
│   ├── mana.ts
│   ├── cost.ts
│   ├── weapon-attack.ts
│   ├── weapon-durability.ts
│   ├── deploy-intension.ts
│   ├── deployers/
│   │   ├── index.ts           — LauncherModel (abstract base)
│   │   ├── card-deployer.ts   — CardDeployerModel (isPlayable, prepare)
│   │   ├── minion-deployer.ts — MinionDeployerModel
│   │   ├── spell-deployer.ts  — SpellDeployerModel + SpellPlayPostEvent/PrevEvent + usePlayerSpellCast
│   │   └── weapon-deployer.ts — WeaponDeployerModel
│   ├── disposers/
│   │   ├── index.ts           — DisposerModel (abstract base)
│   │   ├── minion-disposer.ts — MinionDisposerModel
│   │   ├── weapon-disposer.ts — WeaponDisposerModel
│   │   └── hero-disposer.ts   — HeroDisposerModel
│   └── source/
│       ├── damage-source.ts   — DamageSourceModel + DamageDealEvent/PrevEvent + consumer helpers
│       └── restore-source.ts  — RestoreSourceModel + RestoreDealEvent/PrevEvent + consumer helpers
├── decors/
│   ├── role-attack.ts    — RoleAttackDecor, BuffOperator, BuffOperatorType, consumer helpers
│   ├── role-health.ts    — RoleHealthDecor, consumer helpers
│   ├── spell-damage.ts   — SpellDamageDecor, consumer helpers
│   └── feat-active.ts    — FeatActiveDecor, useFeatActiveDecorConsumer
├── heroes/
│   ├── index.ts          — HeroModel
│   ├── mage.ts           — MageModel
│   └── warrior.ts        — WarriorModel
└── utils/
    ├── controller.ts     — Controller, Selector
    ├── disposer.ts       — registerDisposer, useDisposer
    ├── enums.ts          — RarityType, RaceType, ClassType
    ├── feat-launcher-registry.ts — FeatLauncherRegistry
    ├── feat-selector-registry.ts — FeatSelectorRegistry
    └── sleep.ts          — sleep()
```

**set-piece** decorators used: `@useModel` · `@useState` · `@useMemo` · `@useChild` · `@useRoute` · `@useDecorProducer` · `@useDecorConsumer` · `@useEventConsumer` · `@useAction` · `@useEffect` · `@useRange` · `@useDep`

Events are emitted manually: `this.emitEvent(prevEvent)` → check `prevEvent.isAborted` → work → `this.emitAsyncEvent(postEvent)`. There is no `@useEventProducer`.

---

## 2. Core Entities

Sources: [entities/game.ts](entities/game.ts) · [entities/player.ts](entities/player.ts) · [entities/role.ts](entities/role.ts) · [cards/index.ts](cards/index.ts) · [cards/minion.ts](cards/minion.ts)

```
GameModel
├── playerA / playerB: PlayerModel
│   ├── hero: HeroModel
│   │   ├── role: RoleModel
│   │   │   ├── attack: RoleAttackModel
│   │   │   ├── health: RoleHealthModel
│   │   │   ├── action: RoleActionModel
│   │   │   ├── taunt: TauntModel
│   │   │   ├── divineShield: DivineShieldModel
│   │   │   ├── charge: ChargeModel
│   │   │   ├── rush: RushModel
│   │   │   └── stealth: StealthModel
│   │   └── weapon: WeaponModel?
│   ├── board: BoardModel
│   │   └── minions[]: MinionModel
│   │       ├── role: RoleModel       — same structure as hero.role
│   │       ├── feats: FeatModel[]
│   │       ├── deployer: MinionDeployerModel
│   │       ├── disposer: MinionDisposerModel
│   │       ├── damageSource: DamageSourceModel
│   │       └── restoreSource: RestoreSourceModel
│   ├── hand: HandModel      — CardModel[]
│   ├── deck: DeckModel      — CardModel[]
│   ├── graveyard: GraveyardModel
│   ├── workspace: WorkspaceModel
│   └── mana: ManaModel
├── currentPlayer          — odd turn = playerA
├── turn: number
├── start()                — init game, fire first turn
└── nextTurn()             — TurnEnd events → turn++ → startTurn (wake/reset all roles)
```

Key API:
- `player.drawCard()` / `player.opponent` / `player.controller` / `player.cards` (hand)
- `minion.deployer.summon(player, pos)` / `minion.deployer.launch()`
- `card.feats` / `card.battlecries` / `card.cost.consume()`
- `role.action.launch()` — user-facing attack entry point
- `role.action.isEnabled` — `true` if the role can attack this turn (checks turn, action count, sleep, attack > 0, position, alive)
- `role.action.isAsleep` / `.wakeup()` / `.sleep()` / `.resetCurrent()`
- `role.attack.launch({ target })` — performs attack (fires events, delegates damage)
- `role.attack.setHeroSelectable(bool)` — called by `startTurn`; enables hero targeting after summon turn
- `role.health.receiveDamage({ value, source? })` / `.receiveRestore({ value })`
- `minion.withdraw()` — removes minion from board, adds to owner's hand, strips all non-original feats (`_feats.filter(feat => feat.isOriginal)`)
- Keywords passed via constructor: `new RoleModel({ taunt: new TauntModel({ isActived: true }) })`

---

## 3. Feat System

All card effects live in `FeatModel` subclasses — [feats/index.ts](feats/index.ts)

### Key types

| Type | Description | Source |
|------|-------------|--------|
| `BattlecryModel<T>` | On-play effect; uses `@useBattlecrySelectHook` + `@useBattlecryLaunchHook` | [feats/battlecry.ts](feats/battlecry.ts) |
| `DeathrattleModel` | On-death effect; uses `@useDeathrattleLaunchHook`; fired via `deathrattle.launch()` | [feats/deathrattle.ts](feats/deathrattle.ts) |
| `SpellEffectModel<T>` | Spell effect; uses `@useSpellEffectSelectHook` + `@useSpellEffectLaunchHook` | [feats/spell-effect.ts](feats/spell-effect.ts) |
| Passive `FeatModel` | Event/decor consumers; use `BoardOnlyControllerModel` as a sub-feat to auto-disable off-board | [feats/index.ts](feats/index.ts) |
| Temp buff `FeatModel` | Added via `entity.addFeat()`; `@useTurnEndEventConsumer` → `this.deactive()` | — |

### Hook registration pattern (battlecry example)

```typescript
// In BattlecryModel subclass:
@useBattlecrySelectHook()
protected handleSelect(...targets): Selector<T> | undefined { ... }

@useBattlecryLaunchHook()
protected async handleRun(...targets): Promise<void> { ... }
```

`BattlecryModel.getTargets()` reads the selector registry; `launch(...params)` reads the launcher registry. Same pattern for `SpellEffectModel` (use `@useSpellEffectSelectHook` / `@useSpellEffectLaunchHook`).

### Sub-feats (children of FeatModel)

`SubFeatModel` extends `Model` and routes up to its parent `FeatModel` via `@useRoute(() => FeatModel)`. Common sub-feats:

| Sub-feat | Purpose |
|----------|---------|
| `BoardOnlyControllerModel` | Disables parent feat when minion leaves the board |
| `RoleAttackBuffModel` | Holds a `RoleAttackDecor` consumer for a buff value |
| `RoleHealthBuffModel` | Holds a `RoleHealthDecor` consumer for a buff value |

---

## 4. Keyword Rules (RoleModel)

Passed into `RoleModel` constructor; all default to inactive. Source: [rules/](rules/)

| Keyword       | Model               | Default    | Source |
|---------------|---------------------|------------|--------|
| Taunt         | `TauntModel`        | inactive   | [rules/taunt.ts](rules/taunt.ts) |
| Divine Shield | `DivineShieldModel` | inactive   | [rules/divine-shield.ts](rules/divine-shield.ts) |
| Charge        | `ChargeModel`       | inactive   | [rules/charge.ts](rules/charge.ts) |
| Rush          | `RushModel`         | inactive   | [rules/rush.ts](rules/rush.ts) |
| Stealth       | `StealthModel`      | inactive   | [rules/stealth.ts](rules/stealth.ts) |

`ChargeModel` and `RushModel` extend `FeatModel` and use `@useAsleepDecorConsumer` / `HeroSelectableDecor` consumers to override the default sleep/hero-selectable state when active.

---

## 5. Decor System (Reactive Buffs)

Producer emits a `Decor`; consumers mutate it; `.result` is the final value. Any state read inside a consumer is a reactive dependency.

`BuffOperatorType` (in [decors/role-attack.ts](decors/role-attack.ts)): `COMMON` (permanent additive) · `AURA` (reactive additive, applied last) · `RESET` (set to fixed value)

Sort order in `result()`: non-AURA operators sorted by `source.uuid`, then all AURA operators last. This ensures RESET from a permanent buff always precedes aura additions.

### Decor consumers

| Function | Source | Description |
|----------|--------|-------------|
| `@useRoleAttackDecorConsumer()` | [decors/role-attack.ts](decors/role-attack.ts) | Buff host's own attack |
| `@useAllyRoleAttackDecorConsumer()` | [decors/role-attack.ts](decors/role-attack.ts) | Aura buff all friendly minions' attack |
| `@useRoleHealthDecorConsumer()` | [decors/role-health.ts](decors/role-health.ts) | Buff host's own max health |
| `@useAllyRoleHealthDecorConsumer()` | [decors/role-health.ts](decors/role-health.ts) | Aura buff all friendly minions' health |
| `@usePlayerSpellDamageDecorConsumer()` | [decors/spell-damage.ts](decors/spell-damage.ts) | Add Spell Damage +N to all player's spells |
| `@useFeatActiveDecorConsumer()` | [decors/feat-active.ts](decors/feat-active.ts) | Disable a feat (used by `BoardOnlyControllerModel`) |
| `@useAsleepDecorConsumer()` | [rules/role-action.ts](rules/role-action.ts) | Override sleep state (used by Charge/Rush) |

### Decor producers

| Producer | Decor | Location |
|----------|-------|----------|
| `RoleAttackModel._current` | `RoleAttackDecor` | [rules/role-attack.ts](rules/role-attack.ts) |
| `RoleAttackModel._isHeroSelectable` | `HeroSelectableDecor` | [rules/role-attack.ts](rules/role-attack.ts) |
| `RoleHealthModel._maximum` | `RoleHealthDecor` | [rules/role-health.ts](rules/role-health.ts) |
| `RoleActionModel._isAsleep` | `AsleepDecor` | [rules/role-action.ts](rules/role-action.ts) |
| `FeatModel._isActived` | `FeatActiveDecor` | [feats/index.ts](feats/index.ts) |
| `SpellEffectModel` (spell card) | `SpellDamageDecor` | [cards/mage/fireball/effect.ts](cards/mage/fireball/effect.ts) |

---

## 6. Event System

All events are defined and emitted in the same file as the behavior that produces them. Consumer helpers (exported functions) are also co-located.

Manual emit pattern:
```typescript
const prev = new XxxPrevEvent(options);
this.emitEvent(prev);
if (prev.isAborted) return;
// ... do work ...
const post = new XxxEvent();
this.emitAsyncEvent(post);
```

Events emitted on child models (e.g. `role.attack`, `role.health`) bubble up to parent `role`, so consumer helpers can choose to listen on `role` or the child.

### All consumer helpers

| Function | Constraint | Listens on | Source |
|----------|-----------|------------|--------|
| `@useTurnEndPrevEventConsumer()` | `{ game }` | `game` | [entities/game.ts](entities/game.ts) |
| `@useTurnEndEventConsumer()` | `{ game }` | `game` | [entities/game.ts](entities/game.ts) |
| `@useDamageReceivePrevEventConsumer()` | `RoleFeatIntf` | `role` | [rules/role-health.ts](rules/role-health.ts) |
| `@useDamageReceiveEventConsumer()` | `RoleFeatIntf` | `role.health` | [rules/role-health.ts](rules/role-health.ts) |
| `@useRoleAttackPrevEventConsumer()` | `RoleFeatIntf` | `role.attack` | [rules/role-attack.ts](rules/role-attack.ts) |
| `@useRoleAttackEventConsumer()` | `RoleFeatIntf` | `role.attack` | [rules/role-attack.ts](rules/role-attack.ts) |
| `@useRoleAttackReceivePrevEventConsumer()` | `RoleFeatIntf` | `role` | [entities/role.ts](entities/role.ts) |
| `@useRoleAttackReceiveEventConsumer()` | `RoleFeatIntf` | `role` | [entities/role.ts](entities/role.ts) |
| `@useDamageDealEventConsumer()` | `{ damageSource }` | `damageSource` | [rules/source/damage-source.ts](rules/source/damage-source.ts) |
| `@useDamageDealPrevEventConsumer()` | `{ damageSource }` | `damageSource` | [rules/source/damage-source.ts](rules/source/damage-source.ts) |
| `@useRestoreDealEventConsumer()` | `{ restoreSource }` | `restoreSource` | [rules/source/restore-source.ts](rules/source/restore-source.ts) |
| `@useRestoreDealPrevEventConsumer()` | `{ restoreSource }` | `restoreSource` | [rules/source/restore-source.ts](rules/source/restore-source.ts) |
| `@usePlayerSpellCast()` | `{ player }` | all `card.deployer` in hand | [rules/deployers/spell-deployer.ts](rules/deployers/spell-deployer.ts) |

`RoleFeatIntf` interface (from [feats/index.ts](feats/index.ts)) requires: `role: RoleModel | undefined`, `feat: FeatModel | undefined`, `player: PlayerModel | undefined`.
`FeatIntf` interface requires: `feat: FeatModel | undefined`, `player: PlayerModel | undefined`.

Consumer helper lambda style — always use extracted variables:
```typescript
useEventConsumer((self: I) => {
    const role = self.role;
    const feat = self.feat;
    if (!feat?.isActived) return;
    if (!role) return;
    return [role, SomeEvent]
})(prototype, key, descriptor);
```

---

## 7. Disposer System

Triggered automatically by `@useDisposer()` wrapping `receiveDamage()` and `runAction()`.

```typescript
@useDisposer()
public receiveDamage(options) { ... }   // in RoleHealthModel
```

`registerDisposer(disposer)` queues a disposer for deferred execution. After the outermost `@useDisposer()` frame exits, all queued disposers run in batch. `finishRun()` fires after the board settles, triggering deathrattles.

- `isPending` guard prevents re-entrancy
- `finishRun()` fires outside the batched action — board is already updated when deathrattles execute

---

## 8. Test Harness Patterns

Reference: [cards/neutral/loot-hoarder/index.test.ts](cards/neutral/loot-hoarder/index.test.ts)

- `game.start({ isInitPhaseIgnored: true })` — skip initial draw; use when pre-populating board/hand
- `game.start()` — use when the test needs mana or the draw phase
- PlayerA = odd turns (turn 1), PlayerB = even turns; call `game.nextTurn()` to switch turns

**Async sequences:**
```typescript
// Attack
role.action.launch();
await sleep();
controller.selectTarget(targetRole);
await sleep();

// Play minion (no battlecry target)
minion.deployer.launch();
await sleep();
controller.selectTarget(boardPositionIndex);   // 0 … board.length
await sleep();

// Play minion (with battlecry target)
minion.deployer.launch();
await sleep();
controller.selectTarget(boardPositionIndex);
await sleep();
controller.selectTarget(targetRole);
await sleep();
```

**Assertions:** `disposer.isActived` · `role.attack.current` · `role.health.current` / `.maximum` · `role.action.isEnabled` / `.isAsleep` · `role.divineShield.isActived` · `player.board.minions` / `.cards` · `player.hand.cards` · `controller.selector?.options`

Note: `role.action.isEnabled` returns `true | undefined` (not `true | false`). Assert `toBe(undefined)` for the disabled case.

---

## 9. File Structure for a New Card

```
src/cards/neutral/<card-name>/
  index.ts        — main model class (required)
  index.spec.md   — spec file (required, written first)
  index.test.ts   — test file (required)
  battlecry.ts    — if has battlecry
  buff.ts         — if battlecry applies a temporary buff (extends FeatModel)
  deathrattle.ts  — if has deathrattle
  feat.ts         — if has passive / aura / enrage / "whenever" effect
  feature.ts      — SubFeatModel used inside feat.ts (if complex)

src/cards/derivatives/<token-name>/index.ts
```

---

## 10. Enums Quick Reference

All enums live in [utils/enums.ts](utils/enums.ts):

- **ClassType**: `NEUTRAL | MAGE | PALADIN | WARRIOR | DRUID | HUNTER | PRIEST | ROGUE | SHAMAN | WARLOCK`
- **RarityType**: `BASIC | COMMON | RARE | EPIC | LEGENDARY`
- **RaceType**: `MURLOC | BEAST | DRAGON | PIRATE | DEMON | ELEMENTAL | MECH | TOTEM`

---

## 11. Reference Card Index

| Mechanic | Reference |
|----------|-----------|
| Plain stat-only minion | [cards/neutral/wisp/index.ts](cards/neutral/wisp/index.ts) |
| Token minion | [cards/derivatives/squire/index.ts](cards/derivatives/squire/index.ts) |
| **Feat types** | |
| Battlecry (no target) | [cards/neutral/novice-engineer/battlecry.ts](cards/neutral/novice-engineer/battlecry.ts) |
| Battlecry (targeted) | [cards/neutral/elven-archer/battlecry.ts](cards/neutral/elven-archer/battlecry.ts) |
| Deathrattle | [cards/neutral/loot-hoarder/deathrattle.ts](cards/neutral/loot-hoarder/deathrattle.ts) |
| Passive feat (aura) | [cards/neutral/stormwind-champion/feat.ts](cards/neutral/stormwind-champion/feat.ts) |
| Passive feat (enrage) | [cards/neutral/amani-berserker/feat.ts](cards/neutral/amani-berserker/feat.ts) |
| Passive feat ("whenever") | [cards/neutral/acolyte-of-pain/feat.ts](cards/neutral/acolyte-of-pain/feat.ts) |
| Temp buff feat (EOT removal) | [cards/neutral/abusive-sergeant/buff.ts](cards/neutral/abusive-sergeant/buff.ts) |
| **Effects** | |
| Draw a card | [cards/neutral/novice-engineer/battlecry.ts](cards/neutral/novice-engineer/battlecry.ts) |
| Both players draw | [cards/neutral/coldlight-oracle/battlecry.ts](cards/neutral/coldlight-oracle/battlecry.ts) |
| Deal damage | [cards/neutral/elven-archer/battlecry.ts](cards/neutral/elven-archer/battlecry.ts) |
| Heal a character | [cards/neutral/voodoo-doctor/battlecry.ts](cards/neutral/voodoo-doctor/battlecry.ts) |
| Buff a minion (permanent) | [cards/neutral/shattered-sun-cleric/battlecry.ts](cards/neutral/shattered-sun-cleric/battlecry.ts) |
| Buff a minion (until EOT) | [cards/neutral/abusive-sergeant/battlecry.ts](cards/neutral/abusive-sergeant/battlecry.ts) |
| Aura buff by race | [cards/neutral/southsea-captain/feat.ts](cards/neutral/southsea-captain/feat.ts) |
| Summon token | [cards/neutral/silver-hand-knight/battlecry.ts](cards/neutral/silver-hand-knight/battlecry.ts) |
| Destroy weapon | [cards/neutral/acidic-swamp-ooze/battlecry.ts](cards/neutral/acidic-swamp-ooze/battlecry.ts) |
| Bounce a minion | [cards/neutral/ancient-brewmaster/battlecry.ts](cards/neutral/ancient-brewmaster/battlecry.ts) |
| Spell Damage +N | [feats/spell-damage-feat.ts](feats/spell-damage-feat.ts) |
| **Keywords** | |
| Taunt | [cards/neutral/senjin-shieldmasta/index.ts](cards/neutral/senjin-shieldmasta/index.ts) |
| Divine Shield | [cards/neutral/scarlet-crusader/index.ts](cards/neutral/scarlet-crusader/index.ts) |
| Charge | [cards/neutral/bluegill-warrior/index.ts](cards/neutral/bluegill-warrior/index.ts) |
| Rush | [cards/neutral/stonetusk-boar/index.ts](cards/neutral/stonetusk-boar/index.ts) |
| Stealth | [cards/neutral/stranglethorn-tiger/index.ts](cards/neutral/stranglethorn-tiger/index.ts) |

---

## 12. Runtime Model Tree

`@useChild()` builds the ownership tree; `@useRoute(() => X)` walks up to the nearest ancestor of type `X`.

```
AppModel
└── GameModel
    ├── PlayerModel  (playerA)
    │   ├── ManaModel
    │   ├── HeroModel
    │   │   ├── RoleModel
    │   │   │   ├── RoleAttackModel    ← @useDecorProducer(RoleAttackDecor)
    │   │   │   │                      ← @useDecorProducer(HeroSelectableDecor)
    │   │   │   ├── RoleHealthModel    ← @useDecorProducer(RoleHealthDecor)
    │   │   │   ├── RoleActionModel    ← @useDecorProducer(AsleepDecor)
    │   │   │   ├── TauntModel
    │   │   │   ├── DivineShieldModel
    │   │   │   ├── ChargeModel        (extends FeatModel)
    │   │   │   ├── RushModel          (extends FeatModel)
    │   │   │   └── StealthModel
    │   │   ├── DamageSourceModel
    │   │   ├── RestoreSourceModel
    │   │   ├── HeroDisposerModel
    │   │   ├── FeatModel[]            (hero feats)
    │   │   └── WeaponModel?
    │   │       ├── CostModel
    │   │       ├── WeaponDisposerModel
    │   │       ├── DamageSourceModel
    │   │       └── FeatModel[]
    │   ├── BoardModel
    │   │   └── MinionModel[]
    │   │       ├── CostModel
    │   │       ├── RoleModel          (same structure as hero's RoleModel)
    │   │       ├── MinionDeployerModel
    │   │       ├── MinionDisposerModel
    │   │       ├── DamageSourceModel
    │   │       ├── RestoreSourceModel
    │   │       └── FeatModel[]
    │   │           ├── BattlecryModel<T>
    │   │           │   └── (no sub-feats)
    │   │           ├── DeathrattleModel
    │   │           ├── passive FeatModel
    │   │           │   └── SubFeatModel[]  (e.g. BoardOnlyControllerModel)
    │   │           └── runtime buff FeatModel  (via entity.addFeat())
    │   │               └── SubFeatModel[]  (e.g. RoleAttackBuffModel)
    │   ├── HandModel  → CardModel[]
    │   ├── DeckModel  → CardModel[]
    │   ├── GraveyardModel  → CardModel[]
    │   └── WorkspaceModel  → CardModel[]  (transient staging area)
    └── PlayerModel  (playerB — identical structure)
```

**FeatModel built-in routes:** `this.player` · `this.game` · `this.entity` (`HeroModel | CardModel`) · `this.player?.opponent`

---

## 13. Key Flows

### Minion lifecycle

```
Hand / Deck
└── minion.deployer.summon(player, position)
    └── Board  (action.sleep(), attack.setHeroSelectable(false))
        └── health.current ≤ 0  |  disposer.destroy()
            └── disposer.run()
                ├── removes from board
                └── moves to graveyard
                    └── disposer.finishRun()
                        └── deathrattle.launch() → @useDeathrattleLaunchHook
```

### Role attack flow

```
role.action.launch()                         — checks isEnabled, then:
├── role.attack.getTarget()                  — builds selector (taunt/stealth filtered), fetchTarget
├── role.attack.launch({ target })
│   ├── [RoleAttackPrevEvent on role.attack]  — consumers listen on role.attack (bubbles to role)
│   ├── target._receiveAttack({ source: role })
│   │   ├── [RoleAttackReceivePrevEvent on target]
│   │   ├── source.attack.executeLaunch({ target })
│   │   │   ├── source.damageSource.launch({ target, value: attack })
│   │   │   │   └── target.health.receiveDamage()  →  [RoleDamageReceiveEvent on role.health]
│   │   │   ├── target.damageSource.launch({ target: source, value: target.attack })
│   │   │   │   └── source.health.receiveDamage()  →  [RoleDamageReceiveEvent on role.health]
│   │   │   └── hero.weapon?.durability.consume()   — if attacker is a hero
│   │   └── [RoleAttackReceiveEvent async on target]
│   ├── role.stealth.deactive()
│   └── [RoleAttackEvent async on role.attack]
└── action.consume()
```

### Minion play flow

```
minion.deployer.launch()
├── prepareLaunch()                              — async, all user interaction here
│   ├── controller.fetchTarget(positions)        — user picks board position (0 … board.length)
│   └── battlecry.getTargets()                  — per battlecry: selector hook → fetchTarget loop
├── minion.cost.consume()                        — deduct mana
├── deployer.summon(player, position)
│   ├── prepare(player)                          — move card from hand → workspace
│   ├── spawn(player, position)                  — workspace → board.summonMinion()
│   └── _finishSleep()
│       ├── role.action.sleep()                  — summoning sickness
│       └── role.attack.setHeroSelectable(false) — can't attack hero until next turn (unless Charge)
└── intensions.forEach → intension.launch()
    └── battlecry.launch(...params)              — @useBattlecryLaunchHook on BattlecryModel subclass
```

### Spell play flow

```
spell.deployer.launch()
├── prepareLaunch()
│   └── spellEffect.getTargets()                 — selector hook → fetchTarget per effect
├── spell.cost.consume()
├── prepare(player)                              — hand → workspace (Spell Damage auras still active)
├── intensions.forEach → intension.launch()
│   └── spellEffect.launch(...params)            — @useSpellEffectLaunchHook on SpellEffectModel subclass
├── dispose()
│   ├── workspace.removeCard(spell)
│   └── graveyard.addCard(spell)
└── [SpellPlayPostEvent]                         — triggers @usePlayerSpellCast consumers
```

### Weapon play flow

```
weapon.deployer.launch()
├── weapon.cost.consume()
├── prepare(player)                              — hand → workspace
└── equip()
    ├── workspace.removeCard(weapon)
    └── hero.equipWeapon(weapon)                 — attaches weapon; old weapon disposed
```

### Turn flow

```
game.nextTurn()
├── endTurn({})
│   ├── [TurnEndPrevEvent]
│   └── [TurnEndEvent async]                     — @useTurnEndEventConsumer fires here
├── turn += 1
└── startTurn()
    ├── currentPlayer.mana.addMaximum(1)
    ├── currentPlayer.mana.reset()
    └── for each role (hero + all minions):
        ├── action.wakeup()
        ├── attack.setHeroSelectable(true)
        └── action.resetCurrent()
```
