# Murloc Tidehunter 卡牌设计文档

## 1. 规则说明

Murloc Tidehunter（鱼人招潮者）是一张 2 费 2/1 的随从，战吼：召唤一个 1/1 Murloc Scout。

### 1.1 核心规则

- **战吼效果**：召唤一个 1/1 Murloc Scout
- **召唤位置**：Murloc Scout 被召唤到 Murloc Tidehunter 的右侧
- **无需目标**：战吼不需要选择目标，自动执行

## 2. 实现设计

### 2.1 核心组件

- **MurlocTidehunterModel**：卡牌本体（2/1，费用 2）
- **MurlocTidehunterBattlecryModel**：战吼逻辑，召唤 Murloc Scout
- **MurlocScoutModel**：被召唤的 token 随从（1/1，费用 0）

### 2.2 数据流

1. **打出卡牌**：玩家打出 Murloc Tidehunter
2. **召唤 Tidehunter**：Tidehunter 被召唤到指定位置
3. **执行战吼**：战吼通过 `useRoute` 获取父节点（Tidehunter）
4. **确定位置**：找到 Tidehunter 在 board 上的索引
5. **召唤 Scout**：在 Tidehunter 右侧（index + 1）召唤 Murloc Scout

## 3. 测试场景

**场景设置**：
- playerA hand: murlocTidehunter (2/1, costs 2)
- playerA board: empty
- Turn 1: playerA 有 2 mana

### 3.1 check-initial-state

- playerA board 为空
- playerA 有 2 mana
- murlocTidehunter 在手牌中

### 3.2 play-murloc-tidehunter

- playerA 打出 murlocTidehunter
- 选择位置（boardIndex = 0）
- 验证 murlocTidehunter 在场上
- 验证 murlocScout 被召唤到 murlocTidehunter 的右侧
- 验证 board 上有 2 个随从
