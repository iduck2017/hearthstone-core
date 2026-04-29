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
│   └── role.ts           — RoleModel
├── cards/
│   ├── index.ts          — CardModel (abstract base)
│   ├── minion.ts         — MinionModel
│   ├── spell.ts          — SpellModel
│   ├── weapon.ts         — WeaponModel
│   ├── neutral/<name>/   — one folder per card
│   ├── mage/<name>/
│   └── derivatives/      — token minions
├── feats/
│   ├── index.ts          — FeatModel (abstract base)
│   ├── battlecry.ts      — BattlecryModel<T>
│   ├── deathrattle.ts    — DeathrattleModel
│   ├── role-attack-buff.ts
│   ├── role-health-buff.ts
│   └── spell-damage-feat.ts
├── rules/
│   ├── role-attack.ts
│   ├── role-health.ts
│   ├── role-action.ts
│   ├── taunt.ts
│   ├── charge.ts
│   ├── rush.ts
│   ├── stealth.ts
│   ├── divine-shield.ts
│   ├── mana.ts
│   ├── cost.ts
│   ├── class.ts
│   ├── race.ts
│   ├── rarity.ts
│   ├── board-only-tag.ts
│   └── disposers/
│       ├── index.ts           — DisposerModel (abstract base)
│       ├── minion-disposer.ts — MinionDisposerModel
│       ├── weapon-disposer.ts — WeaponDisposerModel
│       └── hero-disposer.ts   — HeroDisposerModel
├── decors/
│   ├── role-attack.ts
│   ├── role-health.ts
│   ├── spell-damage.ts
│   ├── feat-active.ts
│   ├── asleep.ts
│   └── charge-active.ts
├── event/
│   ├── turn-end.ts
│   ├── role-damage-receive.ts
│   ├── role-attack-perform.ts
│   ├── role-attack-receive.ts
│   ├── damage-deal.ts
│   └── restore-deal.ts
├── hooks/
│   ├── battlecry-run.ts
│   ├── deathrattle-run.ts
│   ├── disposer.ts
│   └── feat-deactive.ts
├── heroes/
│   ├── index.ts
│   ├── mage.ts
│   └── warrior.ts
└── utils/
    ├── controller.ts
    └── sleep.ts
```

**set-piece** decorators: `@useModel` · `@useState` · `@useMemo` · `@useChild` · `@useRoute` · `@useDecorProducer` · `@useDecorConsumer` · `@useEventProducer` · `@useEventConsumer` · `@useAction` · `runAction()`

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
│   │       ├── races: RaceType[]
│   │       ├── feats: FeatModel[]
│   │       ├── disposer: MinionDisposerModel
│   │       └── damageSource / restoreSource
│   ├── hand: HandModel      — CardModel[]
│   ├── deck: DeckModel      — CardModel[]
│   ├── graveyard: GraveyardModel
│   ├── workspace: WorkspaceModel  — transient staging area while a card moves between containers
│   └── mana: ManaModel
├── currentPlayer          — odd turn = playerA
├── turn: number
├── start()                — init game, fire first turn
└── nextTurn()             — TurnEnd events → turn++ → wake/reset all
```

Key API:
- `player.drawCard()` / `player.opponent` / `player.controller`
- `minion.summon(board?, pos?)` / `minion.launcher.launch()`
- `card.addFeature(feat)` / `card.removeFeature(feat)` / `card.consumeMana()`
- `role.receiveDamage({ value })` / `role.runAttack()` / `role.isAttackEnabled`
- Keywords passed via constructor: `new RoleModel({ taunt: new TauntModel({ isActived: true }) })`

---

## 3. Feat System

All card effects live in `FeatModel` subclasses — [feats/index.ts](feats/index.ts)

| Type | Key hook / pattern | Source |
|------|--------------------|--------|
| `BattlecryModel<T>` | `getSelector()` + `@useBattlecryRunHook handleRun()` | [feats/battlecry.ts](feats/battlecry.ts) |
| `DeathrattleModel` | `@useDeathrattleRunHook _run()` — fires after minion moves to graveyard | [feats/deathrattle.ts](feats/deathrattle.ts) |
| Passive `FeatModel` | event/decor consumers + `@useChild _boardOnly: BoardOnlyTagModel` | [feats/index.ts](feats/index.ts) |
| Temp buff `FeatModel` | `addFeature()` at runtime; `@useTurnEndEventConsumer` → `deactive()` | [feats/index.ts](feats/index.ts) |

---

## 4. Keyword Rules (RoleModel)

Passed into `RoleModel` constructor; all default to `false`. Source: [rules/](rules/)

| Keyword       | Model               | Source                                           |
|---------------|---------------------|--------------------------------------------------|
| Taunt         | `TauntModel`        | [rules/taunt.ts](rules/taunt.ts)                 |
| Divine Shield | `DivineShieldModel` | [rules/divine-shield.ts](rules/divine-shield.ts) |
| Charge        | `ChargeModel`       | [rules/charge.ts](rules/charge.ts)               |
| Rush          | `RushModel`         | [rules/rush.ts](rules/rush.ts)                   |
| Stealth       | `StealthModel`      | [rules/stealth.ts](rules/stealth.ts)             |

---

## 5. Decor System (Reactive Buffs)

Producer emits a `Decor`; consumers mutate it; `.result` is the final value. Any state read inside a consumer becomes a reactive dependency.

`BuffOperatorType`: `COMMON` (permanent additive) · `AURA` (reactive additive) · `RESET` (set to fixed value)

| Decorator | Source | Description |
|-----------|--------|-------------|
| `@useRoleAttackDecorConsumer()` | [decors/role-attack.ts](decors/role-attack.ts) | Buff host's own attack |
| `@useAllyRoleAttackDecorConsumer()` | [decors/role-attack.ts](decors/role-attack.ts) | Aura buff all friendly minions' attack |
| `@useRoleHealthDecorConsumer()` | [decors/role-health.ts](decors/role-health.ts) | Buff host's own max health |
| `@useAllyRoleHealthDecorConsumer()` | [decors/role-health.ts](decors/role-health.ts) | Aura buff all friendly minions' health |
| `@usePlayerSpellDamageDecorConsumer()` | [decors/spell-damage.ts](decors/spell-damage.ts) | Add Spell Damage +N to player's spells |
| `@useFeatActiveDecorConsumer()` | [decors/feat-active.ts](decors/feat-active.ts) | Disable a feat when not on board/hero |
| `@useAsleepDecorConsumer()` | [decors/asleep.ts](decors/asleep.ts) | Override sleep state (used by Charge) |
| `@useChargeActiveFlagDecorConsumer()` | [decors/charge-active.ts](decors/charge-active.ts) | Temporarily grant Charge as a reactive aura |

---

## 6. Event System

Prev → action → Post order. Prev can mutate options; Post reacts to result.

| Decorator | Source | Description |
|-----------|--------|-------------|
| `@useTurnEndEventConsumer()` | [event/turn-end.ts](event/turn-end.ts) | After current turn ends |
| `@useTurnEndPrevEventConsumer()` | [event/turn-end.ts](event/turn-end.ts) | Before current turn ends |
| `@useRoleDamageReceiveEventConsumer()` | [event/role-damage-receive.ts](event/role-damage-receive.ts) | After host's role receives damage |
| `@useRoleDamageReceivePrevEventConsumer()` | [event/role-damage-receive.ts](event/role-damage-receive.ts) | Before host's role receives damage |
| `@useRoleAttackPerformEventConsumer()` | [event/role-attack-perform.ts](event/role-attack-perform.ts) | After host's role attacks |
| `@useRoleAttackPerformPrevEventConsumer()` | [event/role-attack-perform.ts](event/role-attack-perform.ts) | Before host's role attacks |
| `@useRoleAttackReceiveEventConsumer()` | [event/role-attack-receive.ts](event/role-attack-receive.ts) | After host's role is attacked |
| `@useRoleAttackReceivePrevEventConsumer()` | [event/role-attack-receive.ts](event/role-attack-receive.ts) | Before host's role is attacked |
| `@useDamageDealEventConsumer()` | [event/damage-deal.ts](event/damage-deal.ts) | After host deals damage |
| `@useDamageDealPrevEventConsumer()` | [event/damage-deal.ts](event/damage-deal.ts) | Before host deals damage |
| `@useRestoreDealEventConsumer()` | [event/restore-deal.ts](event/restore-deal.ts) | After host heals a target |
| `@useRestoreDealPrevEventConsumer()` | [event/restore-deal.ts](event/restore-deal.ts) | Before host heals a target |
| `@useSpellPlayEventConsumer()` | [event/spell-play.ts](event/spell-play.ts) | After player casts a spell; subscribes to `i.player?.hand.cards` |

---


## 8. Test Harness Patterns

Reference: [cards/neutral/loot-hoarder/index.test.ts](cards/neutral/loot-hoarder/index.test.ts)

- `game.start({ isInitPhaseIgnored: true })` — skip initial draw; use when pre-populating board/hand
- `game.start()` — use when the test needs mana or the draw phase
- PlayerA = odd turns, PlayerB = even turns; call `game.nextTurn()` first to test PlayerB

**Async sequences:**
- Attack: `role.runAttack()` → `await sleep()` → `controller.selectTarget(targetRole)` → `await sleep()`
- Play: `card.launcher.launch()` → `await sleep()` → `controller.selectTarget(boardIndex)` → `await sleep()`
- Play with target: add `await sleep()` + `controller.selectTarget(targetRole)` after board index

**Assertions:** `disposer.isActived` · `role.attack.current` · `role.health.current` / `.maximum` · `player.board.minions.length` · `player.hand.cards` · `role.divineShield.isActived` · `controller.selector?.options`

---

## 9. File Structure for a New Card

```
src/cards/neutral/<card-name>/
  index.ts        — main model class (required)
  index.spec.md   — spec file (required, written first)
  index.test.ts   — test file (required)
  battlecry.ts    — if has battlecry
  buff.ts         — if battlecry applies a temporary buff
  deathrattle.ts  — if has deathrattle
  feat.ts         — if has passive / aura / enrage / "whenever" effect

src/cards/derivatives/<token-name>/index.ts
```

---

## 10. Enums Quick Reference

- **ClassType** — [rules/class.ts](rules/class.ts): `NEUTRAL | MAGE | PALADIN | WARRIOR | DRUID | HUNTER | PRIEST | ROGUE | SHAMAN | WARLOCK`
- **RarityType** — [rules/rarity.ts](rules/rarity.ts): `BASIC | COMMON | RARE | EPIC | LEGENDARY`
- **RaceType** — [rules/race.ts](rules/race.ts): `MURLOC | BEAST | DRAGON | PIRATE | DEMON | ELEMENTAL | MECH | TOTEM`

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
| Spell Damage +N | [feats/spell-damage-feat.ts](feats/spell-damage-feat.ts) |
| **Keywords** | |
| Taunt | [cards/neutral/senjin-shieldmasta/index.ts](cards/neutral/senjin-shieldmasta/index.ts) |
| Divine Shield | [cards/neutral/scarlet-crusader/index.ts](cards/neutral/scarlet-crusader/index.ts) |
| Charge | [cards/neutral/wolfrider/index.ts](cards/neutral/wolfrider/index.ts) |
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
    │   │   │   ├── RoleAttackModel       ← @useDecorProducer(RoleAttackDecor)
    │   │   │   ├── RoleHealthModel       ← @useDecorProducer(RoleHealthDecor)
    │   │   │   ├── RoleActionModel
    │   │   │   ├── TauntModel
    │   │   │   ├── DivineShieldModel
    │   │   │   ├── ChargeModel           ← @useDecorProducer(ChargeActiveDecor)
    │   │   │   ├── RushModel
    │   │   │   └── StealthModel
    │   │   └── WeaponModel?
    │   │       ├── CostModel
    │   │       ├── WeaponDisposerModel
    │   │       ├── DamageSourceModel
    │   │       ├── RestoreSourceModel
    │   │       └── FeatModel[]
    │   ├── BoardModel
    │   │   └── MinionModel[]
    │   │       ├── CostModel
    │   │       ├── RoleModel             (same structure as hero's RoleModel)
    │   │       ├── MinionDisposerModel
    │   │       ├── DamageSourceModel
    │   │       ├── RestoreSourceModel
    │   │       └── FeatModel[]
    │   │           ├── BattlecryModel<T>
    │   │           ├── DeathrattleModel
    │   │           ├── passive FeatModel
    │   │           │   ├── BoardOnlyTagModel
    │   │           │   └── RoleAttackBuffModel?
    │   │           └── runtime buff FeatModel  (via addFeature)
    │   │               ├── RoleAttackBuffModel?
    │   │               └── RoleHealthBuffModel?
    │   ├── HandModel  → CardModel[]
    │   ├── DeckModel  → CardModel[]
    │   └── GraveyardModel  → CardModel[]
    └── PlayerModel  (playerB — identical structure)
```

**FeatModel built-in routes:** `this.player` · `this.game` · `this.entity` (MinionModel | HeroModel) · `this.player?.opponent`

---

## 13. Key Flows

### Minion lifecycle

```
Hand / Deck
└── minion.summon(board, position)
    └── Board  (summonedTurn set, action.sleep())
        └── health.current ≤ 0  |  disposer.destroy()
            └── disposer.run()
                └── Graveyard  (removed from board)
                    └── disposer.finishRun()
                        └── deathrattle hooks fire
```

### Role attack flow

```
role.runAttack()                         — checks isAttackEnabled
└── attack.getSelector()                 — builds target list (taunt / stealth filtered)
    └── controller.fetchTarget()         — async: user picks target
        └── role._performAttack(target)
            ├── [RoleAttackPerformPrevEvent]
            ├── action.consumeCurrent()  — uses up the action for this turn
            ├── stealth.deactive()       — attacker loses stealth
            ├── target._receiveAttack(source)
            │   ├── [RoleAttackReceivePrevEvent]
            │   ├── source.attack.run(target)
            │   │   ├── source.damageSource.dealDamage(target, source.attack.current)
            │   │   │   └── target.receiveDamage()  →  [RoleDamageReceiveEvent]
            │   │   └── target.damageSource.dealDamage(source, target.attack.current)
            │   │       └── source.receiveDamage()  →  [RoleDamageReceiveEvent]
            │   └── [RoleAttackReceivePostEvent]
            └── [RoleAttackPerformPostEvent]
```

### Minion play flow

```
minion.launcher.launch()
├── preparePlay()                                — async, all user interaction happens here
│   ├── controller.fetchTarget(positions)        — user picks board position (0 … board.length)
│   └── battlecry.getTargets()                  — per battlecry: getSelector → fetchTarget loop
├── consumeMana()                                — deduct cost from player's mana
├── summon(board, boardIndex)
│   ├── launch()                                — move card from current container → workspace
│   ├── handleSummon(board, position)           — move from workspace → board.summonMinion()
│   │   ├── workspace.removeCard(this)
│   │   └── board.summonMinion(this, position)  — insert into BoardModel
│   └── finishSummon()
│       ├── summonedTurn = game.turn
│       └── role.action.sleep()                 — summoning sickness
└── HooksLauncherModel.next()                   — iterates registry one hook per call
    └── battlecry.run(target)
        ├── isPending = true
        └── @useBattlecryRunHook                — handleRun(target) on the BattlecryModel subclass
```

### Spell play flow

```
spell.launcher.launch()
├── spellEffect.getTargets()                     — async target selection per spell effect
├── consumeMana()                                — deduct cost from player's mana
├── HooksLauncherModel.next()                   — card stays in hand so Spell Damage auras remain active
│   └── spellEffect.run(target)
│       └── @useSpellEffectRunHook              — handleRun(target) on the SpellEffectModel subclass
├── launch()                                     — move card from hand → workspace
└── dispose()                                   — move from workspace → graveyard
    ├── workspace.removeCard(this)
    └── graveyard.disposeCard(this)
```

### Weapon play flow

```
weapon.launcher.launch()
├── consumeMana()                                — deduct cost from player's mana
├── launch()                                     — move card from hand → workspace
└── equip()                                     — move from workspace → hero
    ├── workspace.removeCard(this)
    └── hero.equipWeapon(this)                  — attach weapon to hero; previous weapon is disposed
```

### Disposer execution flow

Triggered automatically by `@useDisposer()` wrapping `receiveDamage()` / `destroy()` / `runAttack()`.

```
@useDisposer() wrapper               — hooks/disposer.ts
├── original method runs             — e.g. receiveDamage / destroy
│   └── registerDisposer(disposer)   — queues disposer into pending registry
├── [batched runAction]              — all run() calls are atomic
│   └── disposer.run()               — per queued disposer
│       ├── isActived check          — health ≤ 0 or isDestroyed
│       ├── container.removeCard()   — remove from Board / Hand / Deck
│       └── graveyard.disposeCard()  — move to GraveyardModel
└── disposer.finishRun()             — after board state settled
    └── deathrattle.run()            — per deathrattle on the minion
        └── @useDeathrattleRunHook   — _run() on the DeathrattleModel subclass
```

- `isPending` guard prevents re-entrancy — nested `@useDisposer()` calls skip the flush
- `finishRun()` fires outside the batched action, so the board is already updated when deathrattles execute
