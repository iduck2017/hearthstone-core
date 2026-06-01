# Mana Addict

## 1. Rules

- **Stats**: 2 cost, 1/3 minion. Rarity: Rare. Class: Neutral.
- **Effect**: "Whenever you cast a spell, gain +2 Attack this turn."
- **Stacks**: Each spell cast adds another +2 Attack (two spells → +4 total).
- **Expires**: The buff is removed at the end of the turn it was gained.
- **Board only**: Only triggers while Mana Addict is on the board.

## 2. Implementation

- **ManaAddictModel** (`index.ts`): MinionModel, 1/3, cost 2, Rare, with `ManaAddictFeatModel`.
- **ManaAddictFeatModel** (`feat.ts`): Passive FeatModel. `@useSpellPlayEventConsumer()` → calls `this.entity?.addFeature(new ManaAddictBuffModel())`. Includes `BoardOnlyTagModel`.
- **ManaAddictBuffModel** (`buff.ts`): Runtime buff FeatModel (added via `addFeature`). Contains `RoleAttackBuffModel(2)`. `@useTurnEndEventConsumer()` → `this.deactive()`.

## 3. Test scenario

**Setup**

- playerA board: `manaAddict` (1/3)
- playerA hand: `fireball` (Fireball, 4 cost)
- playerA mana: 6

**Flow**

1. playerA plays fireball, targets playerB hero.
2. Assert manaAddict.role.attack.current === 3 (+2 from one spell).
3. Cast a second spell; assert attack === 5 (+4 total).
4. `game.nextTurn()` → buff expires.
5. Assert manaAddict.role.attack.current === 1 (back to base).

### 3.1 spell-grants-attack-buff

- Play fireball targeting playerB hero.
- Assert manaAddict.role.attack.current === 3.

### 3.2 buff-stacks-per-spell

- Play two spells in the same turn.
- Assert manaAddict.role.attack.current === 5.

### 3.3 buff-expires-at-turn-end

- Play fireball; assert attack === 3.
- game.nextTurn().
- Assert manaAddict.role.attack.current === 1.

## 4. Reference cards

- Temporary attack buff: `abusive-sergeant/buff.ts` — `RoleAttackBuffModel` + `useTurnEndEventConsumer` → `deactive()`
- "Whenever" passive feat: `acolyte-of-pain/feat.ts` — `BoardOnlyTagModel` + event consumer pattern
- Spell cast event: `event/spell-play.ts` — `useSpellPlayEventConsumer`, subscribes to `i.player?.graveyard.cards`
