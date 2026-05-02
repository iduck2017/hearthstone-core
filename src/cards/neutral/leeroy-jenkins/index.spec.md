# Leeroy Jenkins

## 1. Rules

- **Stats**: 5 cost 6/2 minion.
- **Charge**: Can attack the same turn it is played.
- **Battlecry**: Summon two 1/1 Whelps for your opponent.
- **No target**: Battlecry runs automatically.

## 2. Implementation

- **LeeroyJenkinsModel**: Minion 6/2, cost 5, `charge: new ChargeModel({ isActived: true })`, features: [LeeroyJenkinsBattlecryModel].
- **LeeroyJenkinsBattlecryModel**: No selector; `handleRun` gets `player.opponent`, summons two `WhelpModel` instances to opponent's board.
- **WhelpModel**: Token 1/1, cost 0, in `derivatives/whelp/`.
- **Reference**: `ChargeModel` pattern mirrors `BluegillWarriorModel`; battlecry-summon-to-opponent mirrors `DragonlingMechanicBattlecryModel` (but targets opponent board).

## 3. Test scenario

**Setup**

- playerA hand: `leeroyJenkins`
- playerA mana: maximum 4 (→ 5 after game start)
- playerB board: empty

**Flow**

1. `leeroyJenkins.launcher.launch()` → select board index 0.
2. Battlecry fires → two `WhelpModel` instances (1/1) summoned to playerB's board.
3. Leeroy is on playerA's board with Charge active.

### 3.1 check-initial-state

- playerA.hand contains leeroyJenkins.
- playerB.board.minions.length === 0.

### 3.2 battlecry-summons-two-whelps-for-opponent

- leeroyJenkins.launcher.launch() → select position 0.
- Assert playerA.board.minions contains leeroyJenkins.
- Assert playerB.board.minions.length === 2.
- Assert each minion on playerB.board is WhelpModel with attack 1 and health 1.
- Assert leeroyJenkins.role.action.isEnabled === true (Charge).
