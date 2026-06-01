# Sunwalker

## 1. Rules

- **Stats**: 6 cost 4/5 minion.
- **Taunt**: Enemies must attack this minion if able.
- **Divine Shield**: Absorbs the first instance of damage this minion receives.
- **Rarity**: Rare, Neutral, no race.

## 2. Implementation

- **SunwalkerModel**: Minion 4/5, cost 6, `taunt: new TauntModel({ isActived: true })`, `divineShield: new DivineShieldModel({ isActived: true })`, `rarity: RarityType.RARE`, `class: ClassType.NEUTRAL`, `races: []`.
- No battlecry or deathrattle.
- **Reference**: `TauntModel` mirrors `SenjinShieldmastaModel`; `DivineShieldModel` mirrors `ArgentSquireModel`.

## 3. Test scenario

**Setup**

- playerA board: `wispA` (1/1), `wispB` (1/1)
- playerB board: `sunwalker` (4/5, Taunt, Divine Shield)

**Flow**

1. `wispA.role.runAttack()`, select `sunwalker.role`. Divine Shield absorbs wispA's 1-damage; wispA takes 4 and dies.
2. `wispB.role.runAttack()`, select `sunwalker.role`. No shield; sunwalker takes 1 (health = 4); wispB takes 4 and dies.

### 3.1 check-initial-state

- `sunwalker.role.divineShield.isActived === true`.
- `sunwalker.role.taunt.isActived === true`.

### 3.2 divine-shield-absorbs-first-attack

- `wispA.role.runAttack()` → select `sunwalker.role`.
- Assert `wispA.disposer.isActived === true`.
- Assert `sunwalker.role.divineShield.isActived === false` (shield consumed).
- Assert `sunwalker.role.health.current === 5` (no damage taken).

### 3.3 takes-damage-after-shield-broken

- `wispB.role.runAttack()` → select `sunwalker.role`.
- Assert `sunwalker.role.health.current === 4`.
- Assert `wispB.disposer.isActived === true`.
