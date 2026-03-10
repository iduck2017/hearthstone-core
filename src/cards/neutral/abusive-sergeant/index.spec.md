# Abusive Sergeant 卡牌设计文档

## 1. 规则说明

Abusive Sergeant（叫嚣的中士）是一张 1 费 2/1 的随从，战吼：使一个友方随从获得 +2 攻击力，直到回合结束。

### 1.1 核心规则

- **战吼效果**：选择一个友方随从，使其获得 +2 攻击力
- **Buff 类型**：临时性 buff（回合结束时移除）
- **目标限制**：只能选择友方随从（不能选择英雄）
- **持续时间**：当前回合结束时会自动移除

## 2. 实现设计

### 2.1 核心组件

- **AbusiveSergeantModel**：卡牌本体（2/1，费用 1）
- **AbusiveSergeantBattlecryModel**：战吼逻辑，选择友方随从
- **AbusiveSergeantBuffModel**：+2 攻击力 buff 效果，通过 useRoleAttackBuff 实现，并在回合结束时自动移除

### 2.2 数据流

1. **打出卡牌**：玩家打出 Abusive Sergeant
2. **选择目标**：战吼选择器提供友方随从列表
3. **应用 Buff**：通过 `container.addBuff()` 添加 AbusiveSergeantBuffModel
4. **Buff 生效**：Buff 的 `onMount` 钩子添加攻击力 decor
5. **回合结束**：监听 TurnEndEvent，自动调用 `deactive()` 移除 buff
6. **效果移除**：Buff 的 `onUnmount` 钩子移除攻击力 decor

## 3. 测试场景

**场景设置**：
- playerA hand: abusiveSergeant (2/1, costs 1)
- playerA board: wisp (1/1)
- Turn 1: playerA 有 1 mana

### 3.1 check-initial-state

- wisp 攻击力为 1
- playerA 有 1 mana
- abusiveSergeant 在手牌中

### 3.2 play-abusive-sergeant

- playerA 打出 abusiveSergeant
- 选择位置（boardIndex = 0）
- 选择目标（wisp）
- 验证 wisp 攻击力变为 3
- 验证 abusiveSergeant 在场上

### 3.3 buff-removed-on-turn-end

- 当前回合为 1
- 执行 nextTurn()
- 验证回合数变为 2
- 验证 wisp 攻击力恢复为 1（buff 已移除）
