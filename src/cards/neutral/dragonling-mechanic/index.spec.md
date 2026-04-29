# Dragonling Mechanic

## 1. Rules

- **Stats**: 4 cost 2/4 minion.
- **Battlecry**: Summon a 2/1 Mechanical Dragonling to the right of this minion.
- **No target**: Battlecry runs automatically.

## 2. Implementation

- **DragonlingMechanicModel**: Minion 2/4, cost 4, with battlecry.
- **DragonlingMechanicBattlecryModel**: No selector; `_run` gets parent index, summons MechanicalDragonlingModel at index + 1.
- **MechanicalDragonlingModel**: Token 2/1, cost 0 (e.g. in derivatives/).

## 3. Test scenario

**Setup**

- playerA hand: `dragonlingMechanic`
- playerA board: empty
- playerA mana: 4

**Flow**

1. Play dragonlingMechanic, choose board index 0.
2. Assert dragonlingMechanic on board; mechanicalDragonling summoned to its right; board has 2 minions.

### 3.1 check-initial-state

- playerA.board.cards.length === 0.
- playerA.hand contains dragonlingMechanic.

### 3.2 play-dragonling-mechanic

- dragonlingMechanic.launcher.launch() → select position (boardIndex 0).
- Assert dragonlingMechanic on board.
- Assert mechanicalDragonling summoned to right of dragonlingMechanic.
- Assert playerA.board.minions.length === 2.
