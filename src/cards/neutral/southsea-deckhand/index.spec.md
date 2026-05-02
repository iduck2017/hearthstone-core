# Southsea Deckhand

## 1. Rules

- **Stats**: 1 cost, 2/1 Pirate minion, Neutral, Common.
- **Charge**: Has Charge while you have a weapon equipped.
- **Conditional**: Charge is active only when the controller has a weapon equipped; losing the weapon removes Charge.
- **Edge cases**:
  - Deckhand placed on the board without a weapon → no Charge (summoning sickness applies).
  - Weapon destroyed mid-game → Charge deactivated; deckhand subject to summoning sickness on subsequent turns.
  - Effect is board-only; deckhand in hand does not gain Charge regardless of weapon state.

## 2. Implementation

- **SouthseaDeckshandModel**: extends `MinionModel`, cost 1, 2/1, `ClassType.NEUTRAL`, `RarityType.COMMON`, `races: [RaceType.PIRATE]`, feats: `[new SouthseaDeckshandFeatModel()]`.
  - No static `ChargeModel` override — `RoleModel` defaults to `ChargeModel({ isActived: false })`; the feat activates it reactively via `ChargeActiveDecor`.

- **SouthseaDeckshandFeatModel**: extends `FeatModel`.
  - `@useRoute(() => MinionModel)` → `_minion`, `role` getter: `this._minion?.role`.
  - `@useChild()` `BoardOnlyTagModel` — disables feat (`isActived = false`) when not on board.
  - `@useChargeActiveFlagDecorConsumer()` `_onChargeActiveDecor(decor)`:
    - Guard: `if (!this.isActived) return`.
    - If `this.player?.weapon` → `decor.active()`.

Data flow:
- Weapon equipped → `player.weapon` becomes defined → `_onChargeActiveDecor` re-evaluates → `decor.active()` → `ChargeActiveDecor.result = true` → `ChargeModel.isActived` returns `true` → `ChargeModel.handleSleepStatusCalc` sets `AsleepDecor.result = false` → minion can attack immediately.
- Weapon destroyed → `player.weapon` becomes `undefined` → decor re-evaluates → `active()` not called → `ChargeActiveDecor.result = false` → `isActived = false` → minion subject to summoning sickness again.
- Deckhand not on board → `BoardOnlyTagModel` sets `isActived = false` → guard returns early → `active()` never called.

## 3. Test scenario

**Setup**

- playerA: `WarriorModel` hero, equipped: `fieryWarAxe` (3 atk / 2 dur), board: `deckhand` (2/1 Pirate)
- playerB: `MageModel` hero, board: `wisp1` (1/1), `wisp2` (1/1)

**Flow**

1. Verify `deckhand.role.charge.isActived === true` — `ChargeActiveDecor` activated by weapon aura.
2. Verify `deckhand.role.action.isEnabled === true` — can attack on summon turn.
3. `deckhand.role.runAttack()` → target `playerB.hero.role` → hero loses 2 HP (Mage has 0 attack, deckhand survives).
4. `hero.role.action.wakeup()`, `hero.role.runAttack()` → target `wisp1.role` → wisp1 dies, `fieryWarAxe` durability 2 → 1.
5. `hero.role.action.resetCurrent()`, `hero.role.runAttack()` → target `wisp2.role` → wisp2 dies, durability 1 → 0, weapon destroyed.
6. Assert `playerA.weapon === undefined`.
7. Assert `deckhand.role.charge.isActived === false` — `ChargeActiveDecor` no longer activated.
8. `deckhand.role.action.resetCurrent()` → simulate action refresh.
9. Assert `deckhand.role.action.isEnabled === false` — summoning sickness applies without Charge.

### 3.1 check-initial-state

- `playerA.weapon === fieryWarAxe`.
- `deckhand.role.charge.isActived === true`.
- `deckhand.role.action.isEnabled === true`.

### 3.2 charge-lost-when-weapon-is-destroyed

- `deckhand.role.runAttack()`, select `playerB.hero.role`.
- Assert `playerB.hero.role.health.current === 28`.
- `hero.role.action.wakeup()`, `hero.role.runAttack()`, select `wisp1.role` → `fieryWarAxe.durability.current === 1`.
- `hero.role.action.resetCurrent()`, `hero.role.runAttack()`, select `wisp2.role`.
- Assert `playerA.weapon === undefined`.
- Assert `deckhand.role.charge.isActived === false`.
- `deckhand.role.action.resetCurrent()`.
- Assert `deckhand.role.action.isEnabled === false`.

## 4. Reference cards

- **Wolfrider** (`src/cards/neutral/wolfrider/index.ts`): static Charge — `ChargeModel({ isActived: true })` in `RoleModel`; Southsea Deckhand uses the same field but activates it via `ChargeActiveDecor` aura instead.
- **Bluegill Warrior** (`src/cards/neutral/bluegill-warrior/index.ts`): Charge assertions pattern — `role.charge.isActived` and `isAttackEnabled`.
- **Fiery War Axe** (`src/cards/warrior/fiery-war-axe/index.ts`): weapon exhausted in the test to trigger Charge deactivation.
- **Angry Chicken feat** (`src/cards/neutral/angry-chicken/feat.ts`): `BoardOnlyTagModel` + decor consumer pattern with `isActived` guard.
- **Grimscale Oracle feat** (`src/cards/neutral/grimscale-oracle/feat.ts`): `BoardOnlyTagModel` board-only guard pattern.
- **ChargeActiveDecor** (`src/decors/charge-active.ts`): `active()` method temporarily sets `result = true`; used here to reactively enable Charge without mutating `ChargeModel` state.
