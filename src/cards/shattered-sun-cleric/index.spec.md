# Shattered Sun Cleric 卡牌设计文档

## 1. 规则说明

Shattered Sun Cleric（破碎残阳祭司）是一张 3 费 3/2 的随从，战吼：使一个友方随从获得 +1/+1。

### 1.1 核心规则

- **战吼效果**：选择一个友方随从，使其获得 +1/+1
- **Buff 类型**：永久性 buff（通过 FeatureModel 实现）
- **目标限制**：只能选择友方随从（不能选择英雄）

## 2. 实现设计

### 2.1 核心组件

- **ShatteredSunClericModel**：卡牌本体（3/2，费用 3）
- **ShatteredSunClericBattlecryModel**：战吼逻辑，选择友方随从
- **ShatteredSunClericBuffModel**：+1/+1 buff 效果，通过 RoleAttackDecorModel 和 RoleHealthDecorModel 实现

### 2.2 数据流

1. **打出卡牌**：玩家打出 ShatteredSunCleric
2. **选择目标**：战吼选择器提供友方随从列表
3. **应用 Buff**：通过 `container.addBuff()` 添加 ShatteredSunClericBuffModel
4. **Buff 生效**：Buff 的 `onMount` 钩子添加攻击和生命值 decor
5. **效果验证**：目标随从攻击力和生命值上限各增加 1

## 3. 测试场景

**场景设置**：
- playerA hand: shatteredSunCleric (3/2, costs 3)
- playerA board: wisp (1/1)
- Turn 1: playerA 有 3 mana

### 3.1 check-initial-state

- wisp 攻击力为 1，生命值为 1/1
- playerA 有 3 mana
- shatteredSunCleric 在手牌中

### 3.2 play-shattered-sun-cleric

- playerA 打出 shatteredSunCleric
- 选择位置（boardIndex = 0）
- 选择目标（wisp）
- 验证 wisp 攻击力变为 2
- 验证 wisp 生命上限变为 2
- 验证 wisp 当前生命值变为 2
- 验证 shatteredSunCleric 在场上
