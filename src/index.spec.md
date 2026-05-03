# Implementation Guide

- **`@useAction()`** — Wrap a method with `@useAction()` whenever it involves more than one state mutation, so the framework batches changes into a single atomic transaction. See [arcane-golem/battlecry.ts](src/cards/neutral/arcane-golem/battlecry.ts).
- **Board only** — Feats that should only be active while the minion is on the board use `BoardOnlyControllerModel` as a sub-feat. See [raid-leader/feat.ts](src/cards/neutral/raid-leader/feat.ts).

---

# Feature Index

A quick-lookup table for the **atomic** features that make up implemented cards. Each entry uses the canonical Hearthstone card-text phrasing where possible, and points to a single example whose source illustrates the pattern. A composite effect such as *Battlecry: Draw a card* should be located by looking up `Battlecry` and `Draw a card` separately.

| Feature | Example |
| --- | --- |
| Spell card | [mage/fireball/index.ts](src/cards/mage/fireball/index.ts) |
| Weapon card | [warrior/fiery-war-axe/index.ts](src/cards/warrior/fiery-war-axe/index.ts) |
| Taunt | [senjin-shieldmasta/index.ts](src/cards/neutral/senjin-shieldmasta/index.ts) |
| Divine Shield | [argent-squire/index.ts](src/cards/neutral/argent-squire/index.ts) |
| Charge | [bluegill-warrior/index.ts](src/cards/neutral/bluegill-warrior/index.ts) |
| Rush | [emerald-skytalon/index.ts](src/cards/neutral/emerald-skytalon/index.ts) |
| Stealth | [worgen-infiltrator/index.ts](src/cards/neutral/worgen-infiltrator/index.ts) |
| Spell Damage +N | [dalaran-mage/index.ts](src/cards/neutral/dalaran-mage/index.ts) |
| Battlecry | [elven-archer/battlecry.ts](src/cards/neutral/elven-archer/battlecry.ts) |
| Deathrattle | [loot-hoarder/deathrattle.ts](src/cards/neutral/loot-hoarder/deathrattle.ts) |
| Spell effect | [fireball/effect.ts](src/cards/mage/fireball/effect.ts) |
| At the end of a turn | [baron-geddon/feat.ts](src/cards/neutral/baron-geddon/feat.ts) |
| At the start of a turn | [doomsayer/feat.ts](src/cards/neutral/doomsayer/feat.ts) |
| Whenever this minion takes damage | [acolyte-of-pain/feat.ts](src/cards/neutral/acolyte-of-pain/feat.ts) |
| Whenever a minion dies | [flesheating-ghoul/feat.ts](src/cards/neutral/flesheating-ghoul/feat.ts) |
| Whenever you cast a spell | [gadgetzan-auctioneer/feat.ts](src/cards/neutral/gadgetzan-auctioneer/feat.ts) |
| After you play a card | [pint-sized-summoner/feat.ts](src/cards/neutral/pint-sized-summoner/feat.ts) |
| Target filter | [hungry-crab/battlecry.ts](src/cards/neutral/hungry-crab/battlecry.ts) |
| Random target | [ragnaros-the-firelord/feat.ts](src/cards/neutral/ragnaros-the-firelord/feat.ts) |
| Draw a card | [novice-engineer/battlecry.ts](src/cards/neutral/novice-engineer/battlecry.ts) |
| Draw a Pirate from your deck | [captains-parrot/battlecry.ts](src/cards/neutral/captains-parrot/battlecry.ts) |
| Deal $N damage | [elven-archer/battlecry.ts](src/cards/neutral/elven-archer/battlecry.ts) |
| Restore #N Health | [earthen-ring-farseer/battlecry.ts](src/cards/neutral/earthen-ring-farseer/battlecry.ts) |
| Summon a minion | [razorfen-hunter/battlecry.ts](src/cards/neutral/razorfen-hunter/battlecry.ts) |
| Destroy a weapon | [acidic-swamp-ooze/battlecry.ts](src/cards/neutral/acidic-swamp-ooze/battlecry.ts) |
| Silence a minion | [ironbeak-owl/battlecry.ts](src/cards/neutral/ironbeak-owl/battlecry.ts) |
| Destroy a minion | [doomsayer/feat.ts](src/cards/neutral/doomsayer/feat.ts) |
| Return a minion to its owner's hand | [ancient-brewmaster/battlecry.ts](src/cards/neutral/ancient-brewmaster/battlecry.ts) |
| Give a minion +N/+M | [shattered-sun-cleric/buff.ts](src/cards/neutral/shattered-sun-cleric/buff.ts) |
| Buff expires at end of turn | [abusive-sergeant/buff.ts](src/cards/neutral/abusive-sergeant/buff.ts) |
| Your other minions have +N/+M | [stormwind-champion/feat.ts](src/cards/neutral/stormwind-champion/feat.ts) |
| Your spells have Spell Damage +N | [kobold-geomancer/feat.ts](src/cards/neutral/kobold-geomancer/feat.ts) |
| Your minions cost (N) less | [sea-giant/feat.ts](src/cards/neutral/sea-giant/feat.ts) |
| Enrage: +N Attack while damaged | [tauren-warrior/feat.ts](src/cards/neutral/tauren-warrior/feat.ts) |
| Your weapon has +N Attack | [spiteful-smith/feat.ts](src/cards/neutral/spiteful-smith/feat.ts) |
| Conditional keyword aura | [southsea-deckhand/feat.ts](src/cards/neutral/southsea-deckhand/feat.ts) |
| Cannot attack | [ragnaros-the-firelord/feat.ts](src/cards/neutral/ragnaros-the-firelord/feat.ts) |
| One-shot aura | [pint-sized-summoner/feat.ts](src/cards/neutral/pint-sized-summoner/feat.ts) |
| Spell damage value | [fireball/effect.ts](src/cards/mage/fireball/effect.ts) |
| Give your weapon +N/+N | [captain-greenskin/battlecry.ts](src/cards/neutral/captain-greenskin/battlecry.ts) |
| Whenever you summon a minion of type X | [murloc-tidecaller/feat.ts](src/cards/neutral/murloc-tidecaller/feat.ts) |
| Give your opponent a Mana Crystal | [arcane-golem/battlecry.ts](src/cards/neutral/arcane-golem/battlecry.ts) |
| Freeze a character | [frost-elemental/battlecry.ts](src/cards/neutral/frost-elemental/battlecry.ts) |

---

# Test Authoring Guide

When designing a test scenario, drive the game through **simulated user actions** — never reach inside a feat to trigger its handler directly. Set up the world state via the constructor (`GameModel({ playerA: ..., playerB: ... })`), then advance it only via the user actions below.

A test file uses a **single shared `GameModel`** with multiple `it()` cases that run sequentially in order. Each case advances the same game state from where the previous left off. Only test the card's **core features** — skip edge cases that are already covered by the underlying infrastructure.

| User action | API |
| --- | --- |
| Play card | [`card.deployer.launch()`](src/rules/deployers/card-deployer.ts) |
| Select target | [`player.controller.selectTarget(target)`](src/utils/controller.ts) |
| Attack with hero or minion | [`role.action.launch()`](src/rules/role-action.ts) |
| End the current turn | [`game.nextTurn()`](src/entities/game.ts) |

`await sleep()` is placed **after `selectTarget()`** to let the async behavior triggered by the selection resolve (e.g., battlecry execution, token summons). Only add it when there is async work to wait for — omit it when the selection has no async follow-up.
