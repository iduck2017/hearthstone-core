# Argent Commander

## 1. Rules

- **Stats**: 6 cost 4/2 minion.
- **Charge**: Can attack the same turn it is played.
- **Divine Shield**: Absorbs the first instance of damage this minion receives.
- **Rarity**: Rare, Neutral, no race.

## 2. Implementation

- **ArgentCommanderModel**: Minion 4/2, cost 6, `charge: new ChargeModel({ isActived: true })`, `divineShield: new DivineShieldModel({ isActived: true })`, `rarity: RarityType.RARE`, `class: ClassType.NEUTRAL`, `races: []`.
- No battlecry or deathrattle.
- **Reference**: `ChargeModel` mirrors `StormwindKnightModel`; `DivineShieldModel` mirrors `ArgentSquireModel` and `ScarletCrusaderModel`.

## 3. Test scenario

**Setup**

- playerA hand: `argentCommander` (4/2, Charge, Divine Shield)
- playerA mana: maximum 5 (→ 6 after game start)
- playerB board: `wispA` (1/1), `wispB` (1/1)

**Flow**

1. `argentCommander.play()` → select board position 0. Charge allows immediate attack.
2. `argentCommander.role.runAttack()`, select `wispA.role`. wispA takes 4 and dies; Divine Shield absorbs wispA's 1-damage counter.
3. `game.nextTurn()` → playerB's turn. `wispB.role.runAttack()`, select `argentCommander.role`. Divine Shield is gone; commander takes 1 damage (health = 1), wispB takes 4 and dies.

### 3.1 check-initial-state

- `playerA.hand.cards` contains `argentCommander`.
- `playerB.board.minions.length === 2`.

### 3.2 charge-attack-divine-shield-absorbs-counter

- `argentCommander.play()` → select position 0.
- Assert `argentCommander.role.isAttackEnabled === true` (Charge).
- `argentCommander.role.runAttack()` → select `wispA.role`.
- Assert `wispA.disposer.isActived === true`.
- Assert `argentCommander.role.divineShield.isActived === false` (shield consumed).
- Assert `argentCommander.role.health.current === 2` (no damage taken).

### 3.3 takes-damage-after-shield-broken

- `game.nextTurn()` to advance to playerB's turn.
- `wispB.role.runAttack()` → select `argentCommander.role`.
- Assert `argentCommander.role.health.current === 1`.
- Assert `wispB.disposer.isActived === true`.
