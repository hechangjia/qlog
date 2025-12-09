# Statistics Dashboard 增强功能

## 新增功能

### 1. 📊 Activity Heatmap (活动热力图)

类似GitHub的贡献热力图，展示你的日记和待办活跃度。

**功能特点**:
- ✅ 显示最近52周的活动数据
- ✅ 颜色深浅表示活跃程度（绿色渐变）
- ✅ 悬停显示详细信息
  - 日期
  - 日记条目数
  - 待办事项数
  - 总活动数
- ✅ 显示统计摘要
  - 总活动数
  - 活跃天数
  - 最高活跃日
  - 日均活跃度
- ✅ 显示最长连续活跃天数（Longest Streak）
- ✅ 响应式设计
- ✅ 深色模式支持

**颜色等级**:
- 灰色: 无活动
- 浅绿: 低活跃度 (< 25%)
- 绿色: 中等活跃度 (25-50%)
- 深绿: 高活跃度 (50-75%)
- 墨绿: 极高活跃度 (> 75%)

### 2. 📈 Monthly Trends (月度趋势图)

展示过去12个月的活动趋势。

**功能特点**:
- ✅ 柱状图展示月度数据
- ✅ 蓝色柱 = 日记条目数
- ✅ 绿色柱 = 待办事项数
- ✅ 悬停显示详细数据
- ✅ Y轴自动缩放
- ✅ 月份标签（每年1月显示年份）
- ✅ 统计摘要
  - 总日记条目
  - 总待办事项
  - 已完成待办
- ✅ 显示最高产月份（Most Productive Month）
- ✅ 响应式设计
- ✅ 深色模式支持

## 页面布局

Statistics Dashboard现在的结构：

```
1. Header (标题和描述)
2. Summary Cards (4个统计卡片)
   - 日记总数
   - 待办总数
   - 完成率
   - 平均进度
3. 📊 Activity Heatmap (新增！)
   - 52周活动热力图
   - 活跃度统计
   - 最长连续天数
4. 📈 Monthly Trends (新增！)
   - 12个月趋势图
   - 月度统计
   - 最高产月份
5. Charts (原有图表)
   - 心情分布
   - 优先级分布
   - 状态概览
   - 热门标签
6. Deadlines (截止日期)
   - 逾期任务
   - 即将到期任务
```

## 组件文件

### ActivityHeatmap.astro
位置: `src/components/ActivityHeatmap.astro`

**Props**:
- `diaryEntries`: 日记条目数组
- `todoItems`: 待办事项数组
- `weeks`: 显示周数（默认52）

**特性**:
- 自动计算每天的活动数
- 按周组织数据（从周日开始）
- 动态颜色计算
- 交互式tooltip
- 连续活跃天数计算

### MonthlyTrends.astro
位置: `src/components/MonthlyTrends.astro`

**Props**:
- `diaryEntries`: 日记条目数组
- `todoItems`: 待办事项数组
- `months`: 显示月数（默认12）

**特性**:
- 月度数据聚合
- 双柱状图（日记 + 待办）
- 自动Y轴缩放
- 交互式tooltip
- 最高产月份识别

## 使用示例

### 在statistic页面中使用

```astro
---
import ActivityHeatmap from '@/components/ActivityHeatmap.astro';
import MonthlyTrends from '@/components/MonthlyTrends.astro';

const diaryEntries = await getCollection('diary');
const todoItems = await getCollection('todo');
---

<!-- Activity Heatmap -->
<ActivityHeatmap
  diaryEntries={diaryEntries}
  todoItems={todoItems}
  weeks={52}
/>

<!-- Monthly Trends -->
<MonthlyTrends
  diaryEntries={diaryEntries}
  todoItems={todoItems}
  months={12}
/>
```

### 自定义周数/月数

```astro
<!-- 显示26周（半年） -->
<ActivityHeatmap diaryEntries={diaryEntries} todoItems={todoItems} weeks={26} />

<!-- 显示6个月 -->
<MonthlyTrends diaryEntries={diaryEntries} todoItems={todoItems} months={6} />
```

## 数据计算

### 活动热力图
```typescript
// 每天的活动数 = 日记条目数 + 待办事项数
activity.total = activity.diary + activity.todo;

// 颜色强度 = 活动数 / 最大活动数
intensity = activity.total / maxActivity;

// 连续天数计算
// 遍历所有天数，如果连续有活动则累加，否则重置
```

### 月度趋势
```typescript
// 月度数据聚合
monthlyData = {
  month: '月份名称',
  year: 年份,
  diaryCount: 该月日记数,
  todoCount: 该月待办数,
  completedTodos: 该月完成的待办数
};

// 最高产月份 = 日记数 + 待办数最多的月份
```

## 样式特点

- ✅ 卡片式设计
- ✅ 圆角和阴影
- ✅ 渐变色背景
- ✅ 悬停动画
- ✅ Tooltip提示
- ✅ 响应式布局
- ✅ 深色模式完美支持

## 性能优化

- ✅ 数据在服务端计算
- ✅ 纯CSS动画
- ✅ 最小化JavaScript
- ✅ 高效的数据结构
- ✅ 条件渲染（只显示有数据的部分）

## 交互体验

### 热力图
- 悬停方块查看详情
- 方块放大效果
- 高亮边框
- 详细tooltip

### 月度趋势
- 悬停柱状图查看数据
- 颜色变深效果
- 详细tooltip
- 分离的日记和待办柱

## 浏览器兼容性

支持所有现代浏览器：
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动浏览器

## 未来改进方向

可选的增强功能：
1. 添加周视图切换
2. 添加数据导出功能
3. 添加对比功能（今年 vs 去年）
4. 添加目标设定功能
5. 添加个性化颜色主题
6. 添加动画过渡效果

## 总结

现在Statistics Dashboard包含：
- ✅ 4个统计卡片
- ✅ GitHub风格热力图
- ✅ 月度趋势柱状图
- ✅ 心情分布图
- ✅ 优先级图表
- ✅ 状态饼图
- ✅ 热门标签
- ✅ 截止日期提醒

一个完整的、可视化的数据统计仪表板！🎉
