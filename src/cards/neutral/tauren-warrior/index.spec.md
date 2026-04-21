# Tauren Warrior

## 1. Rules

- **Stats**: 3 cost 2/3 minion.
- **Taunt**: Enemies must attack this minion if able.
- **Enrage**: While damaged (current health < maximum health), gains +3 Attack (effective 5).
- **Edge cases**: Healed to full → +3 lost; damaged again → +3 applies again.

## 2. Implementation

- **TaurenWarriorModel**: Minion 2/3, cost 3, `taunt: new TauntModel({ isActived: true })`, role features: [TaurenWarriorFeatureModel].
- **TaurenWarriorFeatureModel**: `@useRoleAttackDecorConsumer()` — reads `health.current` and `health.maximum`; when damaged, adds AURA +3 to attack decor; reactive re-evaluation removes buff automatically when health is restored.
- **Reference**: taunt mirrors `SenjinShieldmastaModel`; enrage mirrors `AmaniBerserkerFeatureModel` with identical value 3.

## 3. Test scenario

**Setup**

- playerA board: `taurenWarrior` (2/3, Taunt)
- playerB board: `wisp` (1/1)

**Flow**

1. `game.nextTurn()` → playerB's turn.
2. Assert wisp's attack selector excludes playerA's hero (taunt forces targeting taurenWarrior).
3. `wisp.role.runAttack()`, select `taurenWarrior.role`.
4. taurenWarrior takes 1 damage (current 2, max 3) → enrage triggers.
5. wisp takes 2 damage and dies.

### 3.1 check-initial-state

- playerA.board contains taurenWarrior.
- playerB.board contains wisp.
- taurenWarrior.role.taunt.isActived === true.
- taurenWarrior.role.attack.current === 2 (no enrage).

### 3.2 taunt-forces-wisp-to-attack-taunter

- game.nextTurn() → playerB's turn.
- Assert wisp.role.attack.getSelector().options contains only taurenWarrior.role (hero excluded).

### 3.3 enrage-gains-attack-while-damaged

- wisp attacks taurenWarrior.
- Assert taurenWarrior.role.health.current === 2, maximum === 3.
- Assert taurenWarrior.role.attack.current === 5.
- Assert wisp.disposer.isActived === true.
