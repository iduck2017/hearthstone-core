# Silver Hand Knight 卡牌设计文档

## 1. 规则说明

Silver Hand Knight（银手骑士）是一张 5 费 4/4 的随从，战吼：召唤一个 2/2 Squire。

### 1.1 核心规则

- **战吼效果**：召唤一个 2/2 Squire
- **召唤位置**：Squire 被召唤到 Silver Hand Knight 的右侧
- **无需目标**：战吼不需要选择目标，自动执行

## 2. 实现设计

### 2.1 核心组件

- **SilverHandKnightModel**：卡牌本体（4/4，费用 5）
- **SilverHandKnightBattlecryModel**：战吼逻辑，召唤 Squire
- **SquireModel**：被召唤的 token 随从（2/2，费用 0）

### 2.2 数据流

1. **打出卡牌**：玩家打出 Silver Hand Knight
2. **召唤 Knight**：Knight 被召唤到指定位置
3. **执行战吼**：战吼通过 `useRoute` 获取父节点（Knight）
4. **确定位置**：找到 Knight 在 board 上的索引
5. **召唤 Squire**：在 Knight 右侧（index + 1）召唤 Squire

## 3. 测试场景

**场景设置**：
- playerA hand: silverHandKnight (4/4, costs 5)
- playerA board: empty
- Turn 1: playerA 有 5 mana

### 3.1 check-initial-state

- playerA board 为空
- playerA 有 5 mana
- silverHandKnight 在手牌中

### 3.2 play-silver-hand-knight

- playerA 打出 silverHandKnight
- 选择位置（boardIndex = 0）
- 验证 silverHandKnight 在场上
- 验证 squire 被召唤到 silverHandKnight 的右侧
- 验证 board 上有 2 个随从
