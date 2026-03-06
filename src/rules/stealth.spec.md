# Stealth 关键词设计文档

## 1. 规则说明

Stealth（潜行）关键词使随从无法被敌方选择为攻击目标，直到该随从发起攻击后失去潜行。

### 1.1 核心规则

- **无法被选择**：拥有 Stealth 的随从不能被敌方选择为攻击目标
- **攻击后移除**：当 Stealth 随从发起攻击后，立即失去 Stealth 状态
- **与 Taunt 交互**：Stealth 优先级高于 Taunt，Stealth 随从不会被强制选择

## 2. 实现设计

### 2.1 核心组件

- **StealthModel**：管理 Stealth 状态（是否激活）
- **RoleAttackModel.getSelector()**：目标选择时过滤 Stealth 目标
- **RoleModel.attackRole()**：攻击时移除 Stealth 状态

### 2.2 数据流

1. **目标选择**：`RoleAttackModel.getSelector()` 过滤掉所有 `stealth.isActived === true` 的目标
2. **执行攻击**：攻击者选择目标并执行攻击
3. **移除 Stealth**：攻击者在 `attackRole()` 中移除自己的 Stealth 状态

## 3. 测试场景

### 3.1 初始状态

**场景设置**：
- playerA board: wispA (1/1) — current player, has 1 action
- playerB board: wispB (1/1, no stealth) + infiltrator (2/1, stealth)

**测试内容**：
- 验证 infiltrator 有 stealth active
- 验证 wispB 和两个英雄都没有 stealth
- 验证 wispA 有行动次数，wispB 没有（非当前玩家）

### 3.2 Stealth 限制目标选择

**场景设置**：
- playerA board: wispA (1/1) — current player
- playerB board: wispB (1/1) + infiltrator (2/1, stealth)

**测试内容**：
- wispA 攻击时，目标选择器必须排除 infiltrator（stealth）
- 只能选择 wispB 和 playerB 的英雄
- 选择 wispB 后，双方都死亡（1/1 vs 1/1）

### 3.3 攻击时移除 Stealth

**场景设置**（在 3.2 之后，wispA 和 wispB 已死亡）：
- playerB board: infiltrator (2/1, stealth) — 仍然存活
- playerB 的回合

**测试内容**：
- infiltrator 攻击前有 stealth
- infiltrator 攻击 playerA 的英雄
- 攻击后 infiltrator 失去 stealth

