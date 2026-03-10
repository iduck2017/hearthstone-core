# Loot Hoarder 卡牌设计文档

## 1. 规则说明

Loot Hoarder（战利品收集者）是一张 2 费 2/1 的随从，亡语：抽一张牌。

### 1.1 核心规则

- **基础身材**：2 费 2/1
- **亡语效果**：当 Loot Hoarder 死亡时，其操控者从自己的牌库顶抽 1 张牌
- **抽牌来源**：从 `player.deck` 顶部抽牌，放入 `player.hand`
- **边界情况**：
  - 如果牌库为空，则不执行任何操作
  - 如果手牌已满，按全局规则处理（本卡不额外指定）

## 2. 实现设计

### 2.1 核心组件

- **LootHoarderModel**：卡牌本体（2/1，费用 2）
- **LootHoarderDeathrattleModel**：亡语逻辑，死亡时触发抽牌

### 2.2 数据流

1. **打出卡牌**：玩家打出 Loot Hoarder，随从进入战场
2. **死亡触发**：
   - Loot Hoarder 满足死亡条件（生命值降到 0 或更低）
   - `MinionDisposerModel` 触发随从死亡流程
   - 执行附加的 `DeathrattleModel` 队列
3. **执行亡语**：
   - 在 `LootHoarderDeathrattleModel._run` 中获取 `player`
   - 调用玩家的抽牌逻辑（等价于 `player.drawCard()` 或 `player.hand.drawCard()`）
4. **抽牌效果**：
   - 从 `player.deck.cards[0]` 取卡
   - 将该卡从 `deck` 移除并加入 `hand`

## 3. 测试场景

**场景设置**：
- playerA
  - deck: `[card1, card2, card3, ...]`（至少 1 张牌，deck 顶为 `topCard`）
  - hand: `[lootHoarder]`
  - board: 空
- playerB: 任意英雄和默认牌库/手牌
- Turn 1: playerA 有足够的 mana 打出 Loot Hoarder

### 3.1 check-initial-state

- 验证 `lootHoarder` 在 playerA 手牌中
- 验证 playerA 牌库顶为 `topCard`
- 验证 playerA 手牌数量为 1（只有 Loot Hoarder）

### 3.2 play-loot-hoarder-and-die

1. playerA 打出 `lootHoarder` 到战场
2. 通过某种方式让 `lootHoarder` 死亡（例如对其造成 1 点伤害）
3. 验证：
   - `lootHoarder` 不在 playerA 战场上
   - playerA 手牌中多出 1 张牌
   - 新抽到的牌是原来 deck 顶的 `topCard`
   - playerA 牌库长度减少 1

### 3.3 deathrattle-with-empty-deck（可选）

- 将 playerA 牌库设置为空
- `lootHoarder` 死亡
- 验证：
  - 不报错
  - 手牌数量不变

