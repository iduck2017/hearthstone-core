# Hungry Crab

## 1. Rules

- **Stats**: 1 cost 1/2 minion, Neutral, Murloc.
- **Battlecry**: Destroy a Murloc and gain +2/+2.
- **Selection**: Can only target Murlocs on both sides of the board.
- **Effect**: If no Murloc available, battlecry has no valid targets.

## 2. Implementation

- **HungryCrabModel**: Minion 1/2, cost 1, race Murloc, rarity EPIC; feats: [HungryCrabBattlecryModel].
- **HungryCrabBattlecryModel**: extends BattlecryModel<MinionModel>; @useBattlecrySelectHook() filters board minions by race (MURLOC only); @useBattlecryLaunchHook() destroys target via disposer.destroy() and applies HungryCrabBuffModel.
- **HungryCrabBuffModel**: extends FeatModel with RoleAttackBuffModel(2) and RoleHealthBuffModel(2) subfeats.
- **Reference**: buff pattern mirrors FrostwolfWarlord (+n/+n with dual buffs); battlecry selection pattern mirrors ElvenArcher (filters by target type).

## 3. Test scenario

**Setup**

- playerA hand: `hungryCrab` (1/2, Murloc, Battlecry)
- playerB board: `murloc` (2/1, Murloc); `wisp` (1/1, no race)

**Flow**

1. `game.nextTurn()` → playerA's turn.
2. playerA plays `hungryCrab`.
3. Verify controller selector options contain only murloc, not wisp.
4. playerA selects murloc.
5. murloc is destroyed → hungryCrab gains +2/+2 (becomes 3/4).

### 3.1 check-initial-state

- playerA.hand contains hungryCrab.
- playerB.board contains murloc and wisp.
- hungryCrab.role.attack.current === 1.
- hungryCrab.role.health.current === 2.

### 3.2 battlecry-selector-filters-murlocs-only

- playerA plays hungryCrab.
- Assert controller.selector.options contains murloc.
- Assert controller.selector.options does not contain wisp.

### 3.3 battlecry-destroys-murloc-and-gains-buff

- playerA selects murloc target.
- Assert murloc.disposer.isActived === true.
- Assert wisp.disposer.isActived === false.
- Assert hungryCrab.role.attack.current === 3 (1+2).
- Assert hungryCrab.role.health.current === 4 (2+2).
