# Angry Chicken

## 1. Rules

- **Stats**: 1 cost 1/1 minion.
- **Enrage**: While damaged (current health < maximum health), has +5 Attack (effective 6); at full health, attack is 1.
- **Edge cases**: Healed to full → +5 lost; damaged again → +5 applies again.

## 2. Implementation

- **AngryChickenModel**: Minion 1/1, cost 1, with Enrage attack buff. Use `useRoleHealthChangeListener` to listen for health changes on this minion’s role; in the handler, compare `role.health.current` with `role.health.maximum` to decide if damaged, then add or remove the +5 attack decor on `role.attack` accordingly.
- **AngryChickenFeatureModel**: When damaged (current < maximum), add +5 to `role.attack` (effective 6); when full health, remove the +5 so `attack.current` is 1.

## 3. Test scenario

**Setup**

- playerA board: `angryChicken` (1/1), `shatteredSunCleric` (2/2, battlecry +1/+1)
- playerB board: `wisp` (1/1)

**Flow**

1. Play shatteredSunCleric, battlecry target angryChicken (angryChicken becomes 2/2).
2. wisp attacks angryChicken; angryChicken takes 1 damage (damaged), Enrage active.
3. Assert angryChicken.role.health.current === 1, angryChicken.role.attack.current === 6.

### 3.1 check-initial-state

- playerA.board contains angryChicken and shatteredSunCleric.
- playerB.board contains wisp.

### 3.2 enrage-gains-attack-while-damaged

- shatteredSunCleric.play() → select position → select angryChicken.role.
- wisp.role.runAttack(), target angryChicken.role.
- Assert angryChicken.role.health.current === 1, angryChicken.role.health.maximum === 2.
- Assert angryChicken.role.attack.current === 6.
