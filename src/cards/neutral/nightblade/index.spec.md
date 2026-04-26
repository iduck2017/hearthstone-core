# Nightblade

## 1. Rules

- **Stats**: 5 cost, 4/4 minion, Neutral, Common.
- **Battlecry**: Deal 3 damage to the enemy hero.
- **Target**: Always the enemy hero, no player selection required.

## 2. Implementation

- **NightbladeBattlecryModel**: extends `BattlecryModel<RoleModel>`.
  - `getSelector()`: returns `undefined` (no target selection; hero is fixed).
  - `@useBattlecryRunHook()` `handleRun()`: `this.entity?.damageSource.dealDamage({ target: opponent.hero.role, value: 3 })`.
- **NightbladeModel**: extends `MinionModel`, 5 cost, 4/4, Neutral, Common, feats = `[new NightbladeBattlecryModel()]`.

## 3. Test scenario

**Setup**

- playerA hand: `nightblade` (Nightblade, 5 cost), mana 10
- playerB hero: MageModel (30 HP)

**Flow**

1. playerA plays `nightblade`, selects board position 0.
2. Battlecry fires → deals 3 damage to playerB hero.

### 3.1 check-initial-state

- playerA.hand.cards contains `nightblade`.
- playerB.hero.role.health.current === 30.

### 3.2 battlecry-deals-three-damage-to-enemy-hero

- `nightblade.play()`, controller selects position 0.
- Assert `playerB.hero.role.health.current === 27`.

## 4. Reference cards

- **Stormpike Commando** (`src/cards/neutral/stormpike-commando/battlecry.ts`): same pattern; target becomes `opponent.hero.role` instead of a selectable minion.
