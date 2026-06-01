# Injured Blademaster

## 1. Rules

- **Stats**: 3 cost 4/7 minion.
- **Battlecry**: Deal 4 damage to HIMSELF. No target selection — always self.
- **Result**: Enters board as 4/3 (7 − 4 health remaining).

## 2. Implementation

- **InjuredBlademasterModel**: Minion 4/7, cost 3, features: [InjuredBlademasterBattlecryModel].
- **InjuredBlademasterBattlecryModel**: `getSelector` returns `undefined` (no target); `handleRun` calls `this._minion?.role.dealDamage({ target: this._minion.role, value: 4 })`.
- **Reference**: no-target battlecry mirrors `NoviceEngineerBattlecryModel`; self-damage uses `role.dealDamage` introduced for this purpose.

## 3. Test scenario

**Setup**

- playerA hand: `injuredBlademaster`; mana: 3

**Flow**

1. `injuredBlademaster.launcher.launch()`, select board position 0.
2. Battlecry fires automatically — deals 4 damage to self.
3. injuredBlademaster enters board as 4/3.

### 3.1 check-initial-state

- playerA.hand contains injuredBlademaster.
- playerA.board is empty.

### 3.2 battlecry-deals-four-damage-to-self

- injuredBlademaster.launcher.launch(), select board position 0.
- Assert playerA.board contains injuredBlademaster.
- Assert injuredBlademaster.role.health.current === 3.
- Assert injuredBlademaster.role.health.maximum === 7.
