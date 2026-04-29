# Abusive Sergeant

## 1. Rules

- **Stats**: 1 cost 2/1 minion.
- **Battlecry**: Give a friendly minion +2 Attack until end of turn.
- **Target**: Friendly minions only (not hero).
- **Duration**: Buff removed at turn end (TurnEndEvent, deactive()).

## 2. Implementation

- **AbusiveSergeantModel**: Minion 2/1, cost 1, with battlecry.
- **AbusiveSergeantBattlecryModel**: Selector options = friendly minions; on run, `target.container.addFeature(AbusiveSergeantBuffModel)`.
- **AbusiveSergeantBuffModel**: +2 Attack via useRoleAttackBuff; useTurnEndEventListener → deactive() at turn end.

## 3. Test scenario

**Setup**

- playerA hand: `abusiveSergeant`
- playerA board: `wisp` (1/1)
- playerA mana: 1

**Flow**

1. Play abusiveSergeant, choose board index, choose target wisp.
2. Assert wisp has +2 attack (current === 3).
3. game.nextTurn().
4. Assert wisp attack back to 1 (buff removed).

### 3.1 check-initial-state

- playerA.board contains wisp, wisp.role.attack.current === 1.
- playerA.hand contains abusiveSergeant.

### 3.2 play-abusive-sergeant

- abusiveSergeant.launcher.launch() → select position → select wisp.role.
- Assert wisp.role.attack.current === 3.

### 3.3 buff-removed-on-turn-end

- game.nextTurn().
- Assert wisp.role.attack.current === 1.
