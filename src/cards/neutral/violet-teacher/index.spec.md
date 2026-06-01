# Violet Teacher

## 1. Rules

- **Stats**: 4 cost, 3/5 minion. Rarity: Rare. Class: Neutral.
- **Effect**: "Whenever you cast a spell, summon a 1/1 Violet Apprentice."
- **Position**: The Apprentice is summoned to the right of Violet Teacher.
- **Board only**: Only triggers while Violet Teacher is on the board.

## 2. Implementation

- **VioletTeacherModel** (`index.ts`): MinionModel, 3/5, cost 4, Rare, with `VioletTeacherFeatModel`.
- **VioletTeacherFeatModel** (`feat.ts`): Passive FeatModel. `@useSpellPlayEventConsumer()` → find teacher's board index via `@useRoute(() => MinionModel)`, summon `VioletApprenticeModel` at `index + 1`. Includes `BoardOnlyTagModel`.
- **VioletApprenticeModel** (`src/cards/derivatives/violet-apprentice/index.ts`): 1/1 token, cost 0, Common.

## 3. Test scenario

**Setup**

- playerA board: `teacher` (3/5)
- playerA hand: `fireball`
- playerA mana: 10

**Flow**

1. playerA plays fireball targeting playerB hero.
2. Assert a VioletApprentice is on playerA board at index 1 (to the right of teacher).
3. Play a second spell; assert two apprentices on board.

### 3.1 check-initial-state

- playerA.board.minions contains teacher.
- playerA.board.minions.length === 1.

### 3.2 spell-summons-apprentice

- Play fireball targeting playerB hero.
- Assert playerA.board.minions.length === 2.
- Assert playerA.board.minions[1] is a VioletApprenticeModel.

### 3.3 second-spell-summons-another-apprentice

- Play a second fireball.
- Assert playerA.board.minions.length === 3.

## 4. Reference cards

- Spell cast trigger: `mana-addict/feat.ts` — `useSpellPlayEventConsumer` + `BoardOnlyTagModel`
- Summon token to the right: `silver-hand-knight/battlecry.ts` — `board.cards.indexOf(minion)` + `summon(board, index + 1)`
- Token minion: `src/cards/derivatives/squire/index.ts`
