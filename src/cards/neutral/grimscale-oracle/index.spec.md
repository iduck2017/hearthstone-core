# Grimscale Oracle

## 1. Rules

- **Stats**: 1 cost 1/1 minion.
- **Race**: Murloc.
- **Aura**: Your other Murlocs have +1 Attack.
- **Edge cases**:
  - Buff applies only to other friendly Murlocs; non-Murloc allies are unaffected.
  - Oracle itself is not buffed (excluded from subscription).
  - Aura is reactive — disappears immediately when Oracle leaves the board.

## 2. Implementation

- **GrimscaleOracleFeatModel**: Uses `useDecorConsumer` directly with a Murloc-filtered
  subscription (not the generic `useAllyRoleAttackDecorConsumer`, which subscribes to all
  allies). The subscription source filters to other friendly Murlocs only — excluding self
  by comparing each minion's attack model against Oracle's own — so the handler can
  unconditionally apply `BuffOperatorType.AURA` +1.
- **GrimscaleOracleModel**: 1/1 Murloc, cost 1, NEUTRAL, COMMON,
  `feats: [new GrimscaleOracleFeatModel()]`. Also requires `BoardOnlyTagModel` on the feat
  (same as Raid Leader) so the aura is only active while Oracle is on the board.
- **Reference**: `RaidLeaderFeatModel` for the overall aura + `BoardOnlyTagModel` pattern;
  `MurlocRaiderModel` for Murloc race meta.

## 3. Test scenario

**Setup**

- playerA board: `grimscaleOracle` (1/1 Murloc), `murlocRaider` (2/1 Murloc), `wisp` (1/1)
- playerB board: `boulderfistOgre` (6/7)

**Flow**

1. Assert murlocRaider gains +1 Attack from aura (attack = 3).
2. Assert wisp is not buffed (attack = 1) — not a Murloc.
3. Assert grimscaleOracle is not self-buffed (attack = 1).
4. grimscaleOracle attacks boulderfistOgre → oracle dies (takes 6), ogre survives (takes 1).
5. Assert murlocRaider attack drops back to 2 (aura removed).

### 3.1 check-initial-state

- `murlocRaider.role.attack.current === 3` (2 base + 1 aura).
- `wisp.role.attack.current === 1` (no buff — not a Murloc).
- `grimscaleOracle.role.attack.current === 1` (no self-buff).

### 3.2 aura-removed-when-oracle-dies

- `grimscaleOracle.role.runAttack()`, select `boulderfistOgre.role`.
- Assert `grimscaleOracle.disposer.isActived === true`.
- Assert `murlocRaider.role.attack.current === 2` (aura gone).
