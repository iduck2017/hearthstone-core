# Voodoo Doctor

## 1. Rules

- **Stats**: 1 cost 2/1 minion.
- **Battlecry**: Restore 2 Health to any character (friendly or enemy minion or hero).
- **Cap**: Healing cannot exceed the target's maximum health.

## 2. Implementation

- **VoodooDoctorModel**: Minion 2/1, cost 1, features: [VoodooDoctorBattlecryModel].
- **VoodooDoctorBattlecryModel**: Selector options = all minions on both boards + both heroes (as RoleModel); `handleRun(target)` calls `this.entity?.restoreSource.restoreHealth({ target, value: 2 })`.

## 3. Test scenario

**Setup**

- playerA hand: `voodooDoctor`; board: `injuredBlademaster` (4/3, maximum 7); mana: 1
- playerB board: (empty)

**Flow**

1. `voodooDoctor.play()`, select board position.
2. Battlecry selector offers all characters; choose `injuredBlademaster.role`.
3. injuredBlademaster is restored 2 health: current 3 → 5.

### 3.1 check-initial-state

- playerA.hand contains voodooDoctor.
- playerA.board contains injuredBlademaster; injuredBlademaster.role.health.current === 3.

### 3.2 battlecry-restores-two-health

- voodooDoctor.play(), select board position, select injuredBlademaster.role.
- Assert playerA.board contains voodooDoctor.
- Assert injuredBlademaster.role.health.current === 5.
- Assert injuredBlademaster.role.health.maximum === 7.

## 4. Reference cards

- **ElvenArcherBattlecryModel**: same any-character selector pattern.
- **RestoreSourceModel**: `restoreSource.restoreHealth()` for the heal.
