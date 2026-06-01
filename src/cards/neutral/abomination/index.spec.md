# Abomination

## 1. Rules

- **Stats**: 5 cost 4/4 minion, Neutral.
- **Keywords**: Taunt.
- **Deathrattle**: Deal 2 damage to ALL characters (minions and heroes).
- **Scope**: Damage dealt to all characters on both sides, excluding Abomination itself.

## 2. Implementation

- **AbominationModel**: Minion 4/4, cost 5, Taunt enabled, rarity RARE; feats: [AbominationDeathrattleModel].
- **AbominationDeathrattleModel**: extends DeathrattleModel; @useDeathrattleLaunchHook() — on deathrattle trigger, retrieves all minions and heroes via game state and launches damage (value 2) to each, excluding Abomination itself.
- **Reference**: deathrattle pattern mirrors LootHoarder; damage AoE pattern mirrors BaronGeddon.

## 3. Test scenario

**Setup**

- playerA board: `abominationA` (4/4, Taunt); `wispA` (1/1)
- playerB hand: `fireball` (Spell: deal 6 damage)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. playerB plays `fireball`, targets `abominationA`.
3. abominationA takes 6 damage and dies → deathrattle triggers.
4. All characters take 2 damage: wispA dies, both heroes take 2.

### 3.1 check-initial-state

- playerA.board contains abominationA and wispA.
- playerB.hand contains fireball.
- abominationA has taunt enabled.
- abominationA.role.health.current === 4.
- Both heroes at full health (30).

### 3.2 deathrattle-deals-damage-to-all

- playerB plays fireball, targets abominationA.
- Assert abominationA.disposer.isActived === true.
- Assert wispA.disposer.isActived === true (died from 2 deathrattle damage).
- Assert playerA.hero.role.health.current === 28 (took 2 from deathrattle).
- Assert playerB.hero.role.health.current === 28 (took 2 from deathrattle).
