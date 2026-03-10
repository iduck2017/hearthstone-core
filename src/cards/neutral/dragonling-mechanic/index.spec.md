# Dragonling Mechanic 卡牌设计文档

## 1. 规则说明

Dragonling Mechanic（龙人机械师）是一张 4 费 2/4 的随从，战吼：召唤一个 2/1 Mechanical Dragonling。

### 1.1 核心规则

- **战吼效果**：召唤一个 2/1 Mechanical Dragonling
- **召唤位置**：Mechanical Dragonling 被召唤到 Dragonling Mechanic 的右侧
- **无需目标**：战吼不需要选择目标，自动执行

## 2. 实现设计

### 2.1 核心组件

- **DragonlingMechanicModel**：卡牌本体（2/4，费用 4）
- **DragonlingMechanicBattlecryModel**：战吼逻辑，召唤 Mechanical Dragonling
- **MechanicalDragonlingModel**：被召唤的 token 随从（2/1，费用 0）

### 2.2 数据流

1. **打出卡牌**：玩家打出 Dragonling Mechanic
2. **召唤 Mechanic**：Mechanic 被召唤到指定位置
3. **执行战吼**：战吼通过 `useRoute` 获取父节点（Mechanic）
4. **确定位置**：找到 Mechanic 在 board 上的索引
5. **召唤 Dragonling**：在 Mechanic 右侧（index + 1）召唤 Mechanical Dragonling

## 3. 测试场景

**场景设置**：
- playerA hand: dragonlingMechanic (2/4, costs 4)
- playerA board: empty
- Turn 1: playerA 有 4 mana

### 3.1 check-initial-state

- playerA board 为空
- playerA 有 4 mana
- dragonlingMechanic 在手牌中

### 3.2 play-dragonling-mechanic

- playerA 打出 dragonlingMechanic
- 选择位置（boardIndex = 0）
- 验证 dragonlingMechanic 在场上
- 验证 mechanicalDragonling 被召唤到 dragonlingMechanic 的右侧
- 验证 board 上有 2 个随从
