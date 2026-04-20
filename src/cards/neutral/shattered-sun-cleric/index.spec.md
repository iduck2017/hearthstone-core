# Shattered Sun Cleric

## 1. Rules

- **Stats**: 3 cost 3/2 minion.
- **Battlecry**: Give a friendly minion +1/+1.
- **Target**: Friendly minions only (not hero).
- **Buff type**: Permanent (FeatureModel).

## 2. Implementation

- **ShatteredSunClericModel**: Minion 3/2, cost 3, with battlecry.
- **ShatteredSunClericBattlecryModel**: Selector options = friendly minions; on run, `target.container.addFeature(ShatteredSunClericBuffModel)`.
- **ShatteredSunClericBuffModel**: +1/+1 via RoleAttackDecorModel and RoleHealthDecorModel (useMountHook).

## 3. Test scenario

**Setup**

- playerA hand: `shatteredSunCleric`
- playerA board: `wisp` (1/1)
- playerA mana: 3

**Flow**

1. Play shatteredSunCleric, choose board index, choose target wisp.
2. Assert wisp has +1/+1 (attack 2, health 2/2).

### 3.1 check-initial-state

- playerA.board contains wisp, wisp.role.attack.current === 1, wisp.role.health.current === 1.
- playerA.hand contains shatteredSunCleric.

### 3.2 play-shattered-sun-cleric

- shatteredSunCleric.play() → select position → select wisp.role.
- Assert wisp.role.attack.current === 2.
- Assert wisp.role.health.current === 2, wisp.role.health.maximum === 2.
