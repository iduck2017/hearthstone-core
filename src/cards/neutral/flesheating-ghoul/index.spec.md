# Flesheating Ghoul

## 1. Rules

- **Stats**: 3 cost 3/3 minion.
- **Effect**: Whenever a minion dies, gain +1 Attack permanently.
- **Stacking**: Each minion death adds another +1, with no cap.
- **Off-board**: Effect does not trigger when Flesheating Ghoul is not in play.

## 2. Implementation

- **FlesheatingGhoulModel**: Minion 3/3, cost 3, role features: [FlesheatingGhoulFeatModel].
- **FlesheatingGhoulFeatModel**: `@useMinionDisposeEventConsumer()` — on each post-event, calls `this.entity.addFeat(new FlesheatingGhoulBuffModel())`.
- **FlesheatingGhoulBuffModel**: extends FeatModel with RoleAttackBuffModel(1) subfeat. No expiry; persists for the rest of the game.
- **Reference**: buff pattern mirrors `GurubashiBerserkerBuffModel`; event trigger uses `MinionDisposePostEvent` which fires after minion destruction; `BoardOnlyControllerModel` subfeat prevents effect trigger when off-board.

## 3. Test scenario

**Setup**

- playerA board: `flesheatingGhoul` (3/3)
- playerB board: `wispA` (1/1), `wispB` (1/1); hand: `elvenArcher` (1/1, Battlecry: deal 1 damage)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. playerB plays `elvenArcher`, battlecry targets `wispA`.
3. wispA dies → flesheatingGhoul gains +1 Attack (effective 4).
4. playerB passes; `game.nextTurn()` → playerA's turn.
5. flesheatingGhoul attacks wispB.
6. wispB dies → flesheatingGhoul gains another +1 Attack (effective 5).

### 3.1 check-initial-state

- playerA.board contains flesheatingGhoul.
- playerB.board contains two wisps; playerB.hand contains elvenArcher.
- flesheatingGhoul.role.attack.current === 3 (no buff yet).

### 3.2 battlecry-death-grants-plus-one-attack

- playerB plays elvenArcher, battlecry targets wispA.
- Assert flesheatingGhoul.role.attack.current === 4.
- Assert wispA.disposer.isActived === true.

### 3.3 combat-death-stacks-another-plus-one

- playerA attacks wispB with flesheatingGhoul.
- Assert flesheatingGhoul.role.attack.current === 5.
- Assert wispB.disposer.isActived === true.
