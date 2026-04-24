# Cairne Bloodhoof

## 1. Rules

- **Stats**: 6 cost 5/5 minion.
- **Taunt** (not yet implemented; pending Taunt feature).
- **Deathrattle**: Summon a 5/5 Baine Bloodhoof.

## 2. Implementation

- **CairneBloodhoofModel**: Minion 5/5, cost 6, features: [CairneBloodhoofDeathrattleModel].
- **CairneBloodhoofDeathrattleModel**: In `_run`, summon `BaineBloodhoofModel` to player's board.
- **BaineBloodhoofModel**: Token 5/5, cost 0, in derivatives/.
- **Reference**: mirrors `HarvestGolemDeathrattleModel` and `DamagedGolemModel`.

## 3. Test scenario

**Setup**

- playerA board: `cairneBloodhoof` (5/5)
- playerB board: `boulderfistOgre` (6/7)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. `boulderfistOgre.role.runAttack()`, select `cairneBloodhoof.role`.
3. cairneBloodhoof takes 6 damage → dies; boulderfistOgre takes 5 damage → survives (2 health).
4. Deathrattle triggers → summon Baine Bloodhoof (5/5) to playerA board.

### 3.1 check-initial-state

- playerA.board contains cairneBloodhoof.
- playerB.board contains boulderfistOgre.

### 3.2 deathrattle-summons-baine-on-death

- boulderfistOgre attacks cairneBloodhoof.
- Assert cairneBloodhoof.disposer.isActived === true.
- Assert playerA.board.minions.length === 1.
- Assert that minion is BaineBloodhoofModel with attack 5 and health 5.
