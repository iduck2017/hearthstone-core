# Frostwolf Warlord

## 1. Rules

- **Stats**: 5 cost, 4/4 minion, Neutral, Common.
- **Battlecry**: Gain +1/+1 for each other friendly minion on the board at the time of play.
- **Edge cases**: No other friendly minions → no buff. Self is not counted.

## 2. Implementation

- **FrostwolfWarlordBattlecryModel**: extends `BattlecryModel<Model>`.
  - `getSelector()`: returns `undefined` (no target).
  - `@useBattlecryLaunchHook()` `handleRun()`:
    - Count `n = player.board.minions.length - 1` (exclude self, warlord is already on board when battlecry fires).
    - If `n <= 0` return.
    - Apply `RoleAttackBuffModel` and `RoleHealthBuffModel` with value `n` to the warlord's role.
- **FrostwolfWarlordModel**: extends `MinionModel`, 5 cost, 4/4, Neutral, Common, feats = `[new FrostwolfWarlordBattlecryModel()]`.

## 3. Test scenario

**Setup**

- playerA board: `wisp1` (1/1), `wisp2` (1/1)
- playerA hand: `frostwolfWarlord` (5 cost), mana 10

**Flow**

1. playerA plays `frostwolfWarlord`, selects board position 0.
2. Battlecry fires: 2 other friendly minions → +2/+2.
3. Warlord becomes 6/6.

### 3.1 check-initial-state

- playerA.board.cards contains `wisp1` and `wisp2`.
- playerA.hand.cards contains `frostwolfWarlord`.

### 3.2 battlecry-buffs-per-friendly-minion

- `frostwolfWarlord.launcher.launch()`, controller selects position 0.
- Assert `frostwolfWarlord.role.attack.current === 6`.
- Assert `frostwolfWarlord.role.health.current === 6`.

## 4. Reference cards

- **Dark Iron Dwarf** (`src/cards/neutral/dark-iron-dwarf/battlecry.ts`): pattern for applying attack buff in a battlecry.
- **Abusive Sergeant** (`src/cards/neutral/abusive-sergeant/battlecry.ts`): pattern for applying role buff via `RoleAttackBuffModel`.
