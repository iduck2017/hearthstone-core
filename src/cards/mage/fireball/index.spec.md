# Fireball

## 1. Rules

- **Stats**: 4 cost spell, Mage class, Common rarity.
- **Effect**: Deal 6 damage to any character (any minion or hero on either side of the board).
- **Target**: Exactly one character, chosen by the caster.
- **Edge cases**: Can target friendly characters. 6 damage can kill a minion or bring a hero to 0 HP.

## 2. Implementation

- **FireballEffectModel**: extends `SpellEffectModel<RoleModel>`.
  - `getSelector()`: options = all characters' roles: `[...player.board.minions, ...opponent.board.minions, player.hero, opponent.hero].map(c => c.role)`.
  - `@useSpellEffectRunHook()` `handleRun(target?)`: calls `this.entity?.damageSource.dealDamage({ target, value: 6 })`.
- **FireballModel**: extends `SpellModel`, cost 4, class Mage, Common, feats = `[new FireballEffectModel()]`.

## 3. Test scenario

**Setup**

- playerA hand: `fireball` (Fireball, 4 cost)
- playerB board: `yeti` (Chillwind Yeti, 4/5)

**Flow**

1. playerA plays `fireball`, controller selects `yeti.role` as target.
2. Fireball deals 6 damage to yeti (5 - 6 = -1 HP) → yeti dies.
3. Fireball enters playerA's graveyard.

### 3.1 check-initial-state

- playerA.hand.cards contains `fireball`.
- playerB.board.cards contains `yeti`.

### 3.2 fireball-kills-target-and-enters-graveyard

- `fireball.play()`, controller returns `yeti.role`.
- Assert `yeti.disposer.isActived === true`.
- Assert `playerB.board.cards.length === 0`.
- Assert `playerA.graveyard.cards` contains `fireball`.
- Assert `playerA.mana.current === playerA.mana.total - 4`.

## 4. Reference cards

- **Stormpike Commando** (`src/cards/neutral/stormpike-commando/battlecry.ts`): same `getSelector()` → `RoleModel[]` + `dealDamage({ target, value })` pattern; Fireball widens the target pool to all characters and sets value to 6.
- **SpellEffectModel** (`src/feats/spell-effect.ts`): base class providing `getSelector` / `getTargets` / `run` skeleton.
