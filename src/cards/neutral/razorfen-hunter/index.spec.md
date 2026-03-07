# Razorfen Hunter 卡牌设计文档

## 1. 规则说明

Razorfen Hunter（剃刀沼泽猎手）是一张 3 费 2/3 的随从，战吼：召唤一个 1/1 Boar。

### 1.1 核心规则

- **战吼效果**：召唤一个 1/1 Boar
- **召唤位置**：Boar 被召唤到 Razorfen Hunter 的右侧
- **无需目标**：战吼不需要选择目标，自动执行

## 2. 实现设计

### 2.1 核心组件

- **RazorfenHunterModel**：卡牌本体（2/3，费用 3）
- **RazorfenHunterBattlecryModel**：战吼逻辑，召唤 Boar
- **BoarModel**：被召唤的 token 随从（1/1，费用 0）

### 2.2 数据流

1. **打出卡牌**：玩家打出 Razorfen Hunter
2. **召唤 Hunter**：Hunter 被召唤到指定位置
3. **执行战吼**：战吼通过 `asRoute` 获取父节点（Hunter）
4. **确定位置**：找到 Hunter 在 board 上的索引
5. **召唤 Boar**：在 Hunter 右侧（index + 1）召唤 Boar

## 3. 测试场景

**场景设置**：
- playerA hand: razorfenHunter (2/3, costs 3)
- playerA board: empty
- Turn 1: playerA 有 3 mana

### 3.1 check-initial-state

- playerA board 为空
- playerA 有 3 mana
- razorfenHunter 在手牌中

### 3.2 play-razorfen-hunter

- playerA 打出 razorfenHunter
- 选择位置（boardIndex = 0）
- 验证 razorfenHunter 在场上
- 验证 boar 被召唤到 razorfenHunter 的右侧
- 验证 board 上有 2 个随从
