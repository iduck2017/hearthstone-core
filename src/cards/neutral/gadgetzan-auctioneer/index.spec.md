# Gadgetzan Auctioneer

## 1. Rules

- **Stats**: 6 cost, 4/4 minion. Rarity: Rare. Class: Neutral.
- **Effect**: "Whenever you cast a spell, draw a card."
- **Board only**: Only triggers while Gadgetzan Auctioneer is on the board.
- **Edge cases**: Deck empty → `drawCard()` does nothing.

## 2. Implementation

- **GadgetzanAuctioneerModel** (`index.ts`): MinionModel, 4/4, cost 6, Rare, with `GadgetzanAuctioneerFeatModel`.
- **GadgetzanAuctioneerFeatModel** (`feat.ts`): Passive FeatModel. `@useSpellPlayEventConsumer()` → `this.player?.drawCard()`. Includes `BoardOnlyTagModel`.

## 3. Test scenario

**Setup**

- playerA board: `auctioneer` (4/4)
- playerA hand: `fireball`
- playerA deck: `deckWisp`
- playerA mana: 10

**Flow**

1. playerA plays fireball targeting playerB hero.
2. Assert playerA.hand contains deckWisp (drawn by auctioneer).

### 3.1 check-initial-state

- playerA.board contains auctioneer.
- playerA.hand contains fireball.
- playerA.deck contains deckWisp.

### 3.2 spell-triggers-draw

- Play fireball targeting playerB hero.
- Assert playerA.hand contains deckWisp.
- Assert playerA.deck.cards.length === 0.

## 4. Reference cards

- Spell cast trigger: `mana-addict/feat.ts` — `useSpellPlayEventConsumer` + `BoardOnlyTagModel`
- Draw on trigger: `acolyte-of-pain/feat.ts` — `this.player?.drawCard()`
