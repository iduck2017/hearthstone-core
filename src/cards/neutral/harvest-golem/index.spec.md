# Harvest Golem

## 1. Rules

- **Stats**: 3 cost 2/3 minion.
- **Deathrattle**: Summon a 2/1 Damaged Golem.
- **Trigger**: When Harvest Golem dies, deathrattle runs; token summoned to controller's board (e.g. token.summon(board)).

## 2. Implementation

- **HarvestGolemModel**: Minion 2/3, cost 3, with deathrattle.
- **HarvestGolemDeathrattleModel**: In `_run`, summon DamagedGolemModel to player's board (e.g. at death position or right of it).
- **DamagedGolemModel**: Token 2/1 in derivatives/.

## 3. Test scenario

**Setup**

- playerA board: `harvestGolem` (2/3)
- playerB board: `bloodfenRaptor` (3/2)

**Flow**

1. harvestGolem attacks bloodfenRaptor; both take lethal damage and die.
2. Deathrattle triggers → summon Damaged Golem (2/1) to playerA board.

### 3.1 check-initial-state

- playerA.board contains harvestGolem.
- playerB.board contains bloodfenRaptor.

### 3.2 deathrattle-summon-damaged-golem-on-death

- harvestGolem.role.runAttack(), select bloodfenRaptor.role.
- Assert harvestGolem.disposer.isActived === true.
- Assert playerA.board.minions.length === 1.
- Assert that minion is DamagedGolemModel, role.attack.current === 2, role.health.current === 1.
