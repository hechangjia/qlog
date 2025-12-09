---
title: "Dataview 完整演示"
description: "Obsidian Dataview 插件的功能展示和实用示例"
date: 2025-12-09
author: "Claude Code"
tags: ["obsidian", "dataview", "query", "database", "demo"]
theme: "night"
transition: "slide"
backgroundTransition: "fade"
controls: true
progress: true
slideNumber: true
center: true
draft: false
---

<!-- Title Slide -->
<section class="center">

# 📊 Dataview 完整演示

## 将你的笔记库变成数据库

> Obsidian Dataview 插件完整功能展示

<div class="small">
作者: Claude Code | 日期: 2025-12-09
</div>

</section>

---

<!-- What is Dataview -->
<section>

## 🤔 什么是 Dataview？

<div class="fragment">

**Dataview** 是 Obsidian 的强大插件，可以：
- 📝 查询和展示笔记数据
- 📈 创建动态统计视图
- 🔍 过滤和排序内容
- 📊 生成实时报表

</div>

<div class="fragment">

**类比**：就像给笔记库添加了 SQL 数据库功能！

</div>

</section>

---

<!-- Basic Query Syntax -->
<section>

<section class="center">

# 📝 基础查询语法

</section>

<section>

## TABLE 查询

最常用的查询类型，以表格形式展示数据：

```sql
TABLE date, mood, weather
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 10
```

<div class="fragment">

展示最近 10 篇日记的日期、心情和天气

</div>

</section>

<section>

## LIST 查询

以列表形式展示：

```sql
LIST
FROM "posts"
WHERE tags contains "技术"
SORT date DESC
```

<div class="fragment">

列出所有包含"技术"标签的文章

</div>

</section>

<section>

## TASK 查询

展示任务项：

```sql
TASK
FROM "todo"
WHERE status != "done"
GROUP BY priority
```

<div class="fragment">

按优先级分组显示未完成任务

</div>

</section>

</section>

---

<!-- Diary Examples -->
<section>

<section class="center">

# 📖 日记查询示例

</section>

<section>

## 心情分析

```sql
TABLE WITHOUT ID
  mood as "心情",
  length(rows) as "次数"
FROM "diary"
WHERE !draft
GROUP BY mood
SORT length(rows) DESC
```

<div class="fragment">

**效果**：统计每种心情出现的次数

</div>

</section>

<section>

## 按地点筛选

```sql
TABLE date, mood, weather
FROM "diary"
WHERE location = "家" AND !draft
SORT date DESC
LIMIT 20
```

<div class="fragment">

**效果**：查看在家写的所有日记

</div>

</section>

<section>

## 本月统计

```sql
TABLE date as "日期", mood as "心情"
FROM "diary"
WHERE date.month = date(today).month
  AND date.year = date(today).year
  AND !draft
SORT date DESC
```

<div class="fragment">

**效果**：本月的所有日记条目

</div>

</section>

</section>

---

<!-- Todo Examples -->
<section>

<section class="center">

# ✅ 待办查询示例

</section>

<section>

## 高优先级任务

```sql
TABLE dueDate as "截止", category as "分类"
FROM "todo"
WHERE priority = "high"
  AND status != "done"
  AND !draft
SORT dueDate ASC
```

<div class="fragment">

**效果**：所有高优先级未完成任务

</div>

</section>

<section>

## 逾期任务

```sql
TABLE dueDate as "已逾期", priority as "优先级"
FROM "todo"
WHERE dueDate < date(today)
  AND status != "done"
  AND !draft
SORT priority DESC, dueDate ASC
```

<div class="fragment">

**效果**：按优先级显示逾期任务

</div>

</section>

<section>

## 按分类统计

```sql
TABLE WITHOUT ID
  category as "分类",
  length(rows) as "总数",
  length(rows.where(r => r.status = "done")) as "已完成"
FROM "todo"
WHERE !draft
GROUP BY category
```

<div class="fragment">

**效果**：每个分类的任务完成情况

</div>

</section>

</section>

---

<!-- DataviewJS -->
<section>

<section class="center">

# 💻 DataviewJS

高级查询与自定义输出

</section>

<section>

## 什么是 DataviewJS？

<div class="two-columns">

<div>

**Dataview 查询**
- SQL 风格语法
- 固定输出格式
- 简单快速
- 适合常规查询

</div>

<div>

**DataviewJS**
- JavaScript 语法
- 完全自定义
- 强大灵活
- 适合复杂逻辑

</div>

</div>

</section>

<section>

## 完成率计算

```javascript
const todos = dv.pages('"todo"').where(p => !p.draft);
const total = todos.length;
const completed = todos.where(p => p.status === "done").length;
const rate = Math.round((completed / total) * 100);

dv.paragraph(`📈 **完成率: ${rate}%**`);
dv.paragraph(`✅ 已完成: ${completed} / ${total}`);
```

<div class="fragment">

**输出**：📈 完成率: 75% <br/> ✅ 已完成: 15 / 20

</div>

</section>

<section>

## 月度趋势

```javascript
const diaries = dv.pages('"diary"').where(p => !p.draft);
const byMonth = {};

diaries.forEach(d => {
  const month = `${d.date.year}-${String(d.date.month).padStart(2, '0')}`;
  byMonth[month] = (byMonth[month] || 0) + 1;
});

dv.table(
  ["月份", "日记数"],
  Object.entries(byMonth).sort().map(([m, count]) => [m, count])
);
```

</section>

<section>

## 标签统计

```javascript
const allContent = [
  ...dv.pages('"diary"').where(p => !p.draft),
  ...dv.pages('"todo"').where(p => !p.draft),
  ...dv.pages('"posts"').where(p => !p.draft)
];

const tagCounts = {};
allContent.forEach(item => {
  if (item.tags) {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

dv.table(["标签", "使用次数"], sorted);
```

</section>

</section>

---

<!-- Advanced Queries -->
<section>

<section class="center">

# 🚀 高级查询技巧

</section>

<section>

## 日期函数

```sql
TABLE date as "日期"
FROM "diary"
WHERE date >= date(today) - dur(7 days)
  AND !draft
SORT date DESC
```

<div class="fragment">

**效果**：最近 7 天的日记

</div>

<div class="fragment">

**其他日期函数**：
- `date(today)` - 今天
- `dur(7 days)` - 7天时长
- `date.year`, `date.month`, `date.day` - 年月日

</div>

</section>

<section>

## 字符串匹配

```sql
LIST
FROM "posts"
WHERE contains(title, "教程")
  OR contains(tags, "tutorial")
  AND !draft
SORT date DESC
```

<div class="fragment">

**效果**：标题或标签包含"教程"的文章

</div>

<div class="fragment">

**其他字符串函数**：
- `contains()` - 包含
- `startswith()` - 以...开始
- `endswith()` - 以...结束

</div>

</section>

<section>

## 多条件过滤

```sql
TABLE dueDate, priority, status
FROM "todo"
WHERE (priority = "high" OR priority = "medium")
  AND status != "done"
  AND dueDate <= date(today) + dur(3 days)
  AND !draft
SORT priority DESC, dueDate ASC
```

<div class="fragment">

**效果**：3天内到期的中高优先级任务

</div>

</section>

</section>

---

<!-- Practical Applications -->
<section>

<section class="center">

# 💡 实用应用场景

</section>

<section>

## 📊 个人仪表板

组合多个查询创建综合视图：

- 📝 今日待办
- 📖 最近日记
- 📈 完成率统计
- 🏷️ 标签云
- ⚠️ 逾期提醒

</section>

<section>

## 📅 每周回顾

```javascript
const startOfWeek = dv.date("today").startOf("week");
const endOfWeek = dv.date("today").endOf("week");

const thisWeek = {
  diaries: dv.pages('"diary"')
    .where(p => p.date >= startOfWeek && p.date <= endOfWeek && !p.draft),
  todos: dv.pages('"todo"')
    .where(p => p.date >= startOfWeek && p.date <= endOfWeek && !p.draft)
};

dv.header(2, "📅 本周活动");
dv.list([
  `📝 ${thisWeek.diaries.length} 篇日记`,
  `✅ ${thisWeek.todos.length} 个新任务`
]);
```

</section>

<section>

## 🎯 目标追踪

```sql
TABLE
  title as "目标",
  progress as "进度",
  status as "状态"
FROM "todo"
WHERE category = "目标"
  AND !draft
SORT progress DESC
```

<div class="fragment">

可视化追踪长期目标进度

</div>

</section>

</section>

---

<!-- Best Practices -->
<section>

<section class="center">

# ✨ 最佳实践

</section>

<section>

## 性能优化

<div class="grid grid-2">

<div class="success-box">

**✅ 推荐**
- 使用 `LIMIT` 限制结果
- 过滤 `!draft` 草稿
- 精确的 `WHERE` 条件
- 合理的 `GROUP BY`

</div>

<div class="warning-box">

**⚠️ 避免**
- 大量数据无限制查询
- 过度嵌套的复杂查询
- 频繁的全库扫描
- 未优化的正则表达式

</div>

</div>

</section>

<section>

## 查询组织

<div class="highlight-box">

**💡 建议**

1. **模块化查询** - 每个查询有明确目的
2. **添加注释** - 解释复杂查询逻辑
3. **统一命名** - 字段名保持一致
4. **版本管理** - 记录查询变更

</div>

</section>

<section>

## 调试技巧

<div class="two-columns">

<div>

**1. 逐步构建**
- 先写基础查询
- 逐步添加条件
- 测试每一步

</div>

<div>

**2. 使用 LIST**
- 快速验证筛选
- 查看实际结果
- 确认数据正确

</div>

</div>

<div class="fragment">

**3. 检查字段名** - 使用 `TABLE file.frontmatter` 查看所有字段

</div>

</section>

</section>

---

<!-- Resources -->
<section>

<section class="center">

# 📚 学习资源

</section>

<section>

## 官方文档

<div class="two-columns">

<div>

**Dataview**
- [官方文档](https://blacksmithgu.github.io/obsidian-dataview/)
- [查询语言参考](https://blacksmithgu.github.io/obsidian-dataview/query/queries/)
- [DataviewJS API](https://blacksmithgu.github.io/obsidian-dataview/api/intro/)

</div>

<div>

**社区资源**
- Obsidian 论坛
- Discord 社区
- GitHub 示例
- YouTube 教程

</div>

</div>

</section>

<section>

## 本地资源

在你的笔记库中：

- 📝 `template/Dashboard.md` - 个人仪表板
- 📖 `template/DATAVIEW-EXAMPLES.md` - 查询示例集合
- 📚 `docs/obsidian-integration-examples.md` - 完整文档

<div class="fragment">

**提示**: 在 Obsidian 中打开这些文件，实时看到查询效果！

</div>

</section>

</section>

---

<!-- Live Demo -->
<section class="center">

# 🎬 实时演示

在 Obsidian 中打开任意模板文件：

1. 📂 打开 `template/Dashboard.md`
2. 👀 查看实时数据
3. ✏️ 修改查询
4. 🔄 立即看到变化

<div class="fragment">

**提示**: Dataview 查询会自动更新，无需刷新！

</div>

</section>

---

<!-- Next Steps -->
<section>

<section class="center">

# 🚀 下一步

</section>

<section>

## 立即开始

<ol class="large">
<li class="fragment">📥 安装 Dataview 插件</li>
<li class="fragment">📝 在笔记中添加 frontmatter</li>
<li class="fragment">🔍 创建第一个查询</li>
<li class="fragment">📊 构建个人仪表板</li>
</ol>

</section>

<section>

## 进阶学习

<div class="three-columns">

<div class="card">

**掌握 SQL 查询**

学习所有查询类型和函数

</div>

<div class="card">

**学习 DataviewJS**

用 JavaScript 实现高级功能

</div>

<div class="card">

**创建模板**

构建可复用的查询模板

</div>

</div>

</section>

</section>

---

<!-- Thank You -->
<section class="center">

# 🎉 感谢观看！

## Dataview 让你的笔记更有价值

<div class="fragment">

✅ 将笔记变成数据库
✅ 实时动态查询
✅ 强大灵活的功能
✅ 无限可能性

</div>

<div class="fragment">

---

<div class="small">
💡 有问题？查看完整文档：`/docs/obsidian-integration-examples`

🌟 开始探索 Dataview 的强大功能！
</div>

</div>

</section>

<!-- Speaker Notes -->
<aside class="notes">
这是 Dataview 完整演示文稿。
涵盖基础查询、高级技巧、DataviewJS、最佳实践等。
使用键盘方向键导航，按 S 键查看演讲者备注。
</aside>
