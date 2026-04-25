# Raid Leader

## 1. Rules

- **Stats**: 2 cost 2/2 minion.
- **Aura**: Your other minions have +1 Attack.
- **Edge cases**: The buff does not apply to Raid Leader itself. The aura is reactive — when Raid Leader leaves the board the buff disappears immediately.

## 2. Implementation

- **RaidLeaderFeatModel**: Uses `@useAllyRoleAttackDecorConsumer()` to subscribe to every allied minion's attack decor. In the handler, skip self by checking `decor.target === this.role?.attack`. Apply `BuffOperatorType.AURA` +1 to all other allies.
- **RaidLeaderModel**: 2/2 minion, cost 2, with `RaidLeaderFeatModel` in feats.

## 3. Test scenario

**Setup**

- playerA board: `raidLeader` (2/2), `wisp` (1/1)

**Flow**

1. Assert wisp gains +1 Attack from the aura.
2. Assert raidLeader's own attack is not buffed.
3. raidLeader attacks wisp; raidLeader dies (2 damage from wisp, 1 health remaining... wait, wisp is 1/1 and raidLeader is 2/2, raidLeader survives).
   - Instead: have a blademaster or something kill raidLeader, then assert buff drops.
   - Simplify: use playerB's wisp to deal damage, but that won't kill raidLeader.
   - Use `raidLeader.role.runAttack()` to attack an enemy, after leader dies verify buff gone.

**Revised flow**

- playerA board: `raidLeader` (2/2), `wisp` (1/1)
- playerB board: `bloodfenRaptor` (3/2)

1. Assert wisp.role.attack.current === 2 (1 base + 1 aura).
2. Assert raidLeader.role.attack.current === 2 (no self-buff).
3. playerA raidLeader attacks bloodfenRaptor: raidLeader takes 3 damage and dies (2 HP), bloodfenRaptor takes 2 and survives (2→0 HP... wait bloodfenRaptor is 3/2 so it dies too).
   - Use a stronger enemy: `boulderfistOgre` (6/7) to kill raidLeader without dying.

**Final flow**

- playerA board: `raidLeader` (2/2), `wisp` (1/1)
- playerB board: `boulderfistOgre` (6/7)

1. Assert wisp attack = 2 (aura active).
2. Assert raidLeader attack = 2 (no self-buff).
3. raidLeader attacks boulderfistOgre: raidLeader dies, ogre survives.
4. Assert wisp attack = 1 (aura removed).

### 3.1 check-initial-state

- playerA.board contains raidLeader and wisp.
- wisp.role.attack.current === 2.
- raidLeader.role.attack.current === 2.

### 3.2 aura-removed-when-raid-leader-dies

- raidLeader.role.runAttack(), select boulderfistOgre.role.
- Assert raidLeader.disposer.isActived === true.
- Assert wisp.role.attack.current === 1.
