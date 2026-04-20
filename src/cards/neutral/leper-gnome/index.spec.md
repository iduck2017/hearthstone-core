# Leper Gnome

## 1. Rules

- **Stats**: 1 cost 2/1 minion.
- **Deathrattle**: Deal 2 damage to the enemy hero.
- **Trigger**: When Leper Gnome dies (e.g. from combat), deathrattle runs; `opponent.hero.role.receiveDamage({ value: 2 })`.

## 2. Implementation

- **LeperGnomeModel**: Minion 2/1, cost 1, with deathrattle.
- **LeperGnomeDeathrattleModel**: In `_run`, get `opponent` from `this.player.opponent`, then `opponent.hero.role.receiveDamage({ value: 2 })`.

## 3. Test scenario

**Setup**

- playerA board: `leperGnome` (2/1)
- playerB board: `wisp` (1/1)

**Flow**

1. leperGnome attacks wisp; both take lethal damage and die.
2. Deathrattle triggers: enemy hero (playerB) takes 2 damage (30 → 28).

### 3.1 check-initial-state

- playerA.board contains leperGnome, playerB.board contains wisp; both at full health.

### 3.2 leper-gnome-attack-wisp

- leperGnome.role.runAttack(), select wisp.role.
- Assert both minions dead (disposer.isActived), playerB hero health 28.
