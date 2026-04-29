# Fiery War Axe

## 1. Rules

- **Stats**: 2 cost Warrior weapon, 3 attack / 2 durability.
- **No special effect**: plain weapon with no text.
- **Equip**: on play, the hero gains 3 attack as an aura (only active during the owner's turn). Each hero attack consumes 1 durability. When durability reaches 0, the weapon is destroyed and removed from the player.

## 2. Implementation

- **FieryWarAxeModel**: extends WeaponModel with cost 2, attack 3, durability 2, ClassType.WARRIOR, RarityType.RARE.
- Uses WeaponModel base logic: WeaponAttackModel provides the aura on hero's RoleAttackDecor; WeaponDurabilityModel tracks charges; WeaponDisposerModel removes the weapon when depleted.

Data flow:
- Play → `player.equipWeapon(this)` → weapon enters player tree → WeaponAttackModel subscription activates → hero gains 3 attack.
- Hero attacks → `RoleAttackModel.run()` → `weapon.durability.consume()` → if `isActived`, `registerDisposer` → `WeaponDisposerModel.run()` calls `player.unequipWeapon()`.

## 3. Test scenario

**Setup**

- playerA: WarriorModel hero, hand: [fieryWarAxe], mana: 10/10
- playerB: board: [wisp1 (1/1), wisp2 (1/1)]

**Flow**

1. `fieryWarAxe.launcher.launch()` → weapon removed from hand, equipped on playerA hero.
2. Assert `playerA.weapon === fieryWarAxe`, `hero.role.attack.current === 3`, `fieryWarAxe.durability.current === 2`.
3. Wake up hero action. `hero.role.runAttack()` → target `wisp1.role` → wisp1 dies, durability 2→1.
4. Reset hero action. `hero.role.runAttack()` → target `wisp2.role` → wisp2 dies, durability 1→0 → weapon destroyed.
5. Assert `playerA.weapon` is undefined.

### 3.1 check-initial-state

- `playerA.hand.cards` contains `fieryWarAxe`.
- `playerA.weapon` is undefined.
- `playerA.hero.role.attack.current === 0` (no weapon yet).

### 3.2 equip-weapon-on-play

- After `fieryWarAxe.launcher.launch()`: `playerA.weapon === fieryWarAxe`.
- `playerA.hero.role.attack.current === 3`.
- `fieryWarAxe.durability.current === 2`.
- `playerA.hand.cards` does not contain `fieryWarAxe`.

### 3.3 weapon-breaks-after-two-attacks

- After two hero attacks: `playerA.weapon` is undefined.

## 4. Reference cards

- **WeaponModel** (`src/cards/weapon.ts`): base weapon class providing equip/attack/durability infrastructure.
- **Arcanite Reaper**: another plain warrior weapon (5/5/2), same implementation pattern.
