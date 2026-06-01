# Stranglethorn Tiger

## 1. Rules

- **Stats**: 5 cost 5/5 Beast minion.
- **Stealth**: cannot be targeted by opponent's attacks or abilities while stealthed. Stealth is removed when the minion attacks.
- **Edge cases**: stealth does not prevent AoE damage; the minion can still attack freely.

## 2. Implementation

- **StranglethornTigerModel**: Minion 5/5, cost 5, `StealthModel({ isActived: true })`, `races: [RaceType.BEAST]`.
- Stealth is removed in `_performAttack` via `this._stealth.deactive()` (handled by RoleModel base).

## 3. Test scenario

**Setup**

- playerA board: `wisp` (1/1)
- playerB board: `tiger` (5/5 Stealth) + `target` wisp (1/1)

**Flow**

1. Verify `tiger.role.stealth.isActived === true`.
2. `wisp.role.runAttack()` → selector must not include `tiger.role` (stealthed); only `target` wisp and playerB hero are offered.
3. Select `target` wisp → both die.
4. Next turn: `tiger.role.runAttack()` → tiger attacks playerA hero → stealth is removed after the attack.

### 3.1 check-initial-state

- `tiger.role.stealth.isActived === true`.
- `wisp.role.action.isEnabled === true`.

### 3.2 stealth-hides-from-attacker

- `wisp.role.runAttack()`: selector contains `target.role` and `playerB.hero.role`, but NOT `tiger.role`.
- Select `target.role` → both wisp and target die.

### 3.3 stealth-removed-on-attack

- `game.nextTurn()` → playerB's turn.
- `tiger.role.runAttack()`, select `playerA.hero.role`.
- Assert `tiger.role.stealth.isActived === false`.
- Assert `playerA.hero.role.health.current === 25` (took 5 damage).

## 4. Reference cards

- **Worgen Infiltrator** (`src/cards/neutral/worgen-infiltrator/index.ts`): same Stealth pattern, 2/1.
- **Jungle Panther** (`src/cards/neutral/jungle-panther/index.ts`): same pattern, 4/2 Beast.
