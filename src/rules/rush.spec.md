# Rush 关键词设计文档

## 1. 规则说明

Rush（突袭）关键词允许随从在召唤的回合立即攻击，但召唤回合只能攻击随从，不能攻击英雄。后续回合可以正常攻击任何目标。

### 1.1 核心规则

- **召唤回合可攻击**：拥有 Rush 的随从在召唤的回合可以立即攻击（类似 Charge）
- **召唤回合限制**：Rush 随从在召唤的回合不能攻击英雄，只能攻击敌方随从
- **后续回合正常**：召唤回合之后，Rush 随从可以正常攻击任何目标（随从或英雄）

### 1.2 与 Charge 的区别

- **Charge**：召唤回合可攻击，可以攻击任何目标（随从或英雄），后续回合也可以攻击任何目标
- **Rush**：召唤回合可攻击，但只能攻击随从；后续回合可以攻击任何目标

## 2. 实现设计

### 2.1 核心组件

- **RushModel**：管理 Rush 状态（是否激活）
- **RoleAttackModel**：管理英雄选择状态（`isHeroSelectable`）
- **MinionModel.finishSummon()**：召唤时处理 Rush 逻辑
- **GameModel.startTurn()**：回合开始时解除 Rush 的英雄攻击限制

### 2.2 数据流

1. **召唤阶段**：Rush 随从召唤时，重置 action 允许立即攻击，同时设置 `attack.isHeroSelectable = false`
2. **攻击选择**：`RoleAttackModel.getSelector()` 根据 `isHeroSelectable` 过滤目标，召唤回合排除英雄
3. **回合开始**：每个回合开始时，所有随从的 `attack.isHeroSelectable` 设置为 `true`

## 3. 测试场景

**场景设置**：
- playerA hand: rushMinion (3/2, Rush, costs 1)
- playerB board: wispB (1/1)
- Turn 1: playerA 有 1 mana

### 3.1 check-initial-state

- rushMinion 在手牌中，rush.isActived = true
- rushMinion 尚未在场上（action.current = 0）

### 3.2 play-rush-minion

- playerA 打出 rushMinion
- rushMinion 进入场上，finishSummon() 触发 action.reset()
- 验证 rushMinion.role.action.current = 1（Rush 允许立即攻击）
- 验证 rushMinion.role.attack.isHeroSelectable = false（召唤回合）

### 3.3 rush-restricts-hero-attack

- rushMinion 发起攻击；目标选择器必须排除 playerB 的英雄，只包含 wispB
- 选择 wispB：wispB (1 hp - 3 dmg) 死亡；rushMinion (3 hp - 1 dmg) 血量为 2

### 3.4 rush-enables-hero-attack-next-turn

- game.nextTurn()（playerB 回合）
- game.nextTurn()（回到 playerA 回合，startTurn() 设置 isHeroSelectable = true）
- 验证 rushMinion.role.attack.isHeroSelectable = true
- rushMinion 发起攻击；目标选择器包含 playerB 的英雄
- 选择 playerB 的英雄：攻击成功

