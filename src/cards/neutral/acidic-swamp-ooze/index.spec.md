# Acidic Swamp Ooze

## 1. Rules

- **Stats**: 2 cost 3/2 Neutral minion, Common.
- **Battlecry**: Destroy your opponent's weapon.
- **Edge cases**: if the opponent has no weapon, the battlecry does nothing.

## 2. Implementation

- **AcidicSwampOozeModel**: Minion 3/2, cost 2, `feats: [new AcidicSwampOozeBattlecryModel()]`.
- **AcidicSwampOozeBattlecryModel**: no target selector. In `handleRun`, get `opponent.weapon`; if present, call `weapon.disposer.destroy()`, `weapon.disposer.run()`, and `weapon.disposer.finishRun()` to immediately flush destruction.

Data flow:
- Battlecry runs → `weapon.disposer.destroy()` sets `isDestroyed = true` → `weapon.disposer.run()` calls `hero.unequipWeapon()` + `player.graveyard.disposeCard(weapon)` → `weapon.disposer.finishRun()` handles any deathrattle chain.

## 3. Test scenario

**Setup**

- playerA hero: equipped with `fieryWarAxe` (Fiery War Axe, 3/2)
- playerB hand: `ooze` (Acidic Swamp Ooze)
- playerB mana: 10/10
- `game.nextTurn()` so it is playerB's turn

### 3.1 check-initial-state

- `playerA.weapon === fieryWarAxe`.
- `fieryWarAxe.durability.current === 2`.

### 3.2 battlecry-destroys-opponent-weapon

- `ooze.launcher.launch()`, select board position.
- Assert `playerA.weapon` is undefined.
- Assert `playerA.graveyard.cards` contains `fieryWarAxe`.

## 4. Reference cards

- **Nightblade** (`src/cards/neutral/nightblade/battlecry.ts`): no-target battlecry pattern.
- **WeaponDisposerModel** (`src/rules/disposers/weapon-disposer.ts`): weapon destruction flow.
- **Fiery War Axe** (`src/cards/warrior/fiery-war-axe/index.ts`): weapon used in test setup.
