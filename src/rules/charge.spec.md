# Charge 关键词设计文档

## 1. 规则说明

Charge（冲锋）关键词允许随从在召唤的回合立即攻击，且可以攻击任何目标（随从或英雄）。

### 1.1 核心规则

- **召唤回合可攻击**：拥有 Charge 的随从在召唤的回合可以立即攻击
- **可攻击任何目标**：Charge 随从可以攻击随从或英雄，没有限制
- **后续回合正常**：召唤回合之后，Charge 随从可以正常攻击任何目标

### 1.2 与 Rush 的区别

- **Charge**：召唤回合可攻击，可以攻击任何目标（随从或英雄），后续回合也可以攻击任何目标
- **Rush**：召唤回合可攻击，但只能攻击随从；后续回合可以攻击任何目标

## 2. 实现设计

### 2.1 核心组件

- **ChargeModel**：管理 Charge 状态（是否激活）
- **RoleAttackModel**：管理英雄选择状态（`isHeroSelectable`）
- **RoleActionModel**：管理 sleep/wakeup 状态
- **MinionModel.finishSummon()**：召唤时处理 Charge 逻辑
- **GameModel.startTurn()**：回合开始时唤醒所有随从

### 2.2 数据流

1. **召唤阶段**：Charge 随从召唤时，调用 `action.sleep()` 默认 sleep，然后调用 `action.wakeup()` 唤醒，同时设置 `attack.isHeroSelectable = true`
2. **攻击选择**：`RoleAttackModel.getSelector()` 根据 `isHeroSelectable` 过滤目标，Charge 随从可以攻击任何目标
3. **回合开始**：每个回合开始时，所有随从的 `action.wakeup()` 和 `action.resetCurrent()`，`attack.isHeroSelectable` 设置为 `true`

## 3. 测试场景

**场景设置**：
- playerA hand: boar (1/1, Charge, costs 1) + wisp (1/1, no charge, costs 0)
- playerB board: target (1/1)
- Turn 1: playerA 有 1 mana

### 3.1 check-initial-state

- boar 和 wisp 在手牌中
- boar.charge.isActived = true
- wisp.charge.isActived = false

### 3.2 play-wisp-no-charge

- playerA 打出 wisp
- wisp 进入场上，finishSummon() 调用 `action.sleep()`
- 验证 wisp.role.isAttackEnabled = false（没有 charge，处于 sleep 状态）

### 3.3 play-boar-with-charge

- playerA 打出 boar
- boar 进入场上，finishSummon() 调用 `action.sleep()` 然后 `action.wakeup()`
- 验证 boar.role.isAttackEnabled = true（Charge 允许立即攻击）
- 验证 boar.role.attack.isHeroSelectable = true（可以攻击英雄）

### 3.4 boar-attacks-immediately

- boar 发起攻击；目标选择器包含 target 和 playerB 的英雄
- 选择 target：target (1 hp - 1 dmg) 死亡；boar (1 hp - 1 dmg) 死亡
- 验证 boar.role.isAttackEnabled = false（攻击后 action.current = 0）
