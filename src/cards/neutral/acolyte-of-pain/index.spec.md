# Acolyte of Pain

## 1. Rules

- **Stats**: 3 cost 1/3 minion.
- **Effect**: Whenever this minion takes damage, draw a card.
- **Stacking**: Triggers once per damage event; multiple hits draw multiple cards.
- **Edge cases**: Divine shield absorbs the hit — no damage dealt, no card drawn.

## 2. Implementation

- **AcolyteOfPainModel**: Minion 1/3, cost 3, role features: [AcolyteOfPainFeatureModel].
- **AcolyteOfPainFeatureModel**: `@useRoleDamageReceiveEventConsumer()` — on each post-event, calls `this.player.drawCard()`. Uses `player` getter inherited from `FeatureModel`.
- **Reference**: event trigger mirrors `GurubashiBerserkerFeatureModel`; draw mirrors `LootHoarderDeathrattleModel`.

## 3. Test scenario

**Setup**

- playerA board: `acolyteOfPain` (1/3); deck: two cards (`wisp`, `wisp2`)
- playerB board: `wisp` (1/1); hand: `elvenArcher` (1/1, Battlecry: deal 1 damage)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. `wisp.role.runAttack()`, select `acolyteOfPain.role`.
3. acolyteOfPain takes 1 combat damage → draws a card (wisp from deck enters hand).
4. playerB plays `elvenArcher`, battlecry targets `acolyteOfPain.role`.
5. acolyteOfPain takes 1 battlecry damage → draws another card (deck now empty).

### 3.1 check-initial-state

- playerA.board contains acolyteOfPain.
- playerA.hand is empty; playerA.deck has 1 card.
- playerB.board contains wisp; playerB.hand contains elvenArcher.

### 3.2 combat-hit-draws-a-card

- wisp attacks acolyteOfPain.
- Assert acolyteOfPain.role.health.current === 2.
- Assert playerA.hand.cards.length === 1; playerA.deck.cards.length === 1.

### 3.3 battlecry-hit-draws-another-card

- playerB plays elvenArcher, battlecry targets acolyteOfPain.role.
- Assert acolyteOfPain.role.health.current === 1.
- Assert playerA.hand.cards.length === 2; playerA.deck.cards.length === 0.
