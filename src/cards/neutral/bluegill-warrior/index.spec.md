# Bluegill Warrior

## 1. Rules

- **Stats**: 2 cost 2/1 Murloc minion.
- **Charge**: can attack the turn it is summoned, including the opponent's hero.
- **Edge cases**: after attacking once, the action is consumed; can no longer attack that turn.

## 2. Implementation

- **BluegillWarriorModel**: Minion 2/1, cost 2, `ChargeModel({ isActived: true })`, `races: [RaceType.MURLOC]`.
- Charge sets `isOpponentHeroSelectable` to true even on the summon turn, so the opponent's hero appears in the target selector immediately.

## 3. Test scenario

**Setup**

- playerA board: `bluegill` (2/1 Charge)
- playerB board: `wisp` (1/1)

**Flow**

1. Verify `bluegill.role.action.isEnabled` is true on the summon turn (Charge).
2. Verify the target selector includes the opponent's hero (Charge bypasses the summon-turn restriction).
3. `bluegill.role.runAttack()` → target `playerB.hero.role` → hero loses 2 health, bluegill loses 0 (hero has 0 attack).
4. After attacking, `bluegill.role.action.current === 0` — can no longer attack.

### 3.1 check-initial-state

- `bluegill.role.charge.isActived === true`.
- `bluegill.role.action.isEnabled === true` (Charge grants immediate attack right).

### 3.2 charge-can-attack-hero-on-summon-turn

- `bluegill.role.runAttack()`, verify selector includes `playerB.hero.role`.
- Select `playerB.hero.role`.
- Assert `playerB.hero.role.health.current === 28`.
- Assert `bluegill.role.health.current === 1` (Warrior hero has 0 base attack, no counter-damage).
- Assert `bluegill.role.action.current === 0`.

## 4. Reference cards

- **Wolfrider** (`src/cards/neutral/wolfrider/index.ts`): same Charge pattern, 3/1.
- **Leeroy Jenkins** (`src/cards/neutral/leeroy-jenkins/index.ts`): Charge with battlecry.
