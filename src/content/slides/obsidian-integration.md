---
title: "Obsidian 插件集成总结"
description: "Templater 和 Dataview 插件完整集成方案演示"
date: 2025-12-09
author: "Claude Code"
tags: ["obsidian", "templater", "dataview", "插件", "workflow"]
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

# 🎉 Obsidian 插件集成

## Templater & Dataview

> 完整的工作流解决方案

<div class="small">
作者: Claude Code | 日期: 2025-12-09
</div>

</section>

---

<!-- Overview -->
<section>

## 📋 概览

<div class="fragment">

✅ **Templater** - 动态模板系统
- 自动填充日期和时间
- 光标位置占位符
- 文件夹级别自动模板

</div>

<div class="fragment">

✅ **Dataview** - 数据查询引擎
- 笔记库变成数据库
- 强大的查询语法
- 实时数据统计

</div>

</section>

---

<!-- Templater Section -->
<section>

<section class="center">

# 📝 Templater 模板系统

</section>

<section>

## 创建的模板

| 模板 | 文件 | 功能 |
|------|------|------|
| 📝 日记 | `diary/templater-template.md` | 自动填充日期、心情、天气 |
| ✅ 待办 | `todo/templater-template.md` | 任务管理、进度追踪 |
| 📚 文章 | `posts/templater-template.md` | 博客文章标准结构 |

</section>

<section>

## 日记模板示例

```yaml
---
title: "<% tp.date.now('YYYY-MM-DD') %> 日记"
date: <% tp.date.now('YYYY-MM-DD') %>
mood: happy
weather: "☀️"
location: ""
---

# <% tp.date.now('YYYY年MM月DD日') %>

💭 今日心情：<% tp.file.cursor(1) %>
```

<div class="fragment small">
使用 `<% %>` 语法插入动态变量
</div>

</section>

<section>

## 关键特性

<div class="grid grid-2">

<div class="card">

### 🔄 自动应用

在对应文件夹创建文件时
自动应用相应模板

</div>

<div class="card">

### 🎯 光标跳转

使用 Tab 键在光标位置间跳转
快速填写内容

</div>

<div class="card">

### 📅 智能日期

支持多种日期格式
包括中文日期显示

</div>

<div class="card">

### ⚙️ 可配置

所有模板都可以
根据需要自定义

</div>

</div>

</section>

</section>

---

<!-- Dataview Section -->
<section>

<section class="center">

# 📊 Dataview 查询系统

</section>

<section>

## 基本查询语法

```sql
TABLE date, mood, weather
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 10
```

<div class="fragment">
将笔记库转换为可查询的数据库
</div>

</section>

<section>

## 查询类型

<div class="three-columns">

<div class="highlight-box">

**📝 日记查询**
- 按日期
- 按心情
- 按地点
- 统计分析

</div>

<div class="warning-box">

**✅ 待办查询**
- 按状态
- 按优先级
- 逾期提醒
- 完成率

</div>

<div class="success-box">

**📚 文章查询**
- 按标签
- 按日期
- 标签统计
- 趋势分析

</div>

</div>

</section>

<section>

## DataviewJS 示例

```javascript
const todos = dv.pages('"todo"').where(p => !p.draft);
const total = todos.length;
const completed = todos.where(p => p.status === "done").length;
const rate = Math.round(completed / total * 100);

dv.paragraph(`📊 完成率: ${rate}%`);
```

<div class="fragment">
使用 JavaScript 进行高级数据处理
</div>

</section>

</section>

---

<!-- Dashboard Section -->
<section>

<section class="center">

# 📈 个人仪表板

实时数据统计面板

</section>

<section>

## Dashboard 功能

<div class="grid grid-2">

<div>

### 📅 今日概览
- 今日日记状态
- 今日待办列表
- 逾期任务提醒

</div>

<div>

### 📊 统计数据
- 本周活动统计
- 任务完成率
- 标签使用分析

</div>

</div>

</section>

<section>

## 数据可视化

<div class="two-columns">

<div>

**显示内容：**
- 最近5篇日记
- 最近5项任务
- 最近5篇文章
- Top 10 标签
- 月度趋势图

</div>

<div>

**实时更新：**
- 自动刷新数据
- 动态查询结果
- 即时统计分析
- 无需手动维护

</div>

</div>

</section>

</section>

---

<!-- Configuration Section -->
<section>

<section class="center">

# ⚙️ 配置说明

</section>

<section>

## Templater 配置

```json
{
  "templates_folder": "template",
  "trigger_on_file_creation": true,
  "auto_jump_to_cursor": true,
  "enable_folder_templates": true,
  "folder_templates": [
    {
      "folder": "diary",
      "template": "template/diary/templater-template.md"
    }
  ]
}
```

</section>

<section>

## 文件结构

```
src/content/
├── diary/                # 日记目录
├── todo/                 # 待办目录
├── posts/                # 文章目录
└── template/             # 模板目录
    ├── diary/
    │   └── templater-template.md
    ├── todo/
    │   └── templater-template.md
    ├── posts/
    │   └── templater-template.md
    ├── Dashboard.md
    └── DATAVIEW-EXAMPLES.md
```

</section>

</section>

---

<!-- Workflow Section -->
<section>

<section class="center">

# 💡 工作流

日常使用流程

</section>

<section>

## 早晨（5分钟）

<ol>
<li class="fragment">📊 打开 Dashboard 查看今日概览</li>
<li class="fragment">✅ 查看今日待办和逾期任务</li>
<li class="fragment">📝 创建新的日记</li>
<li class="fragment">📌 标记重要任务</li>
</ol>

</section>

<section>

## 工作时（随时）

<ol>
<li class="fragment">✅ 在 todo/ 文件夹创建新待办</li>
<li class="fragment">📝 更新任务状态和进度</li>
<li class="fragment">🏷️ 添加合适的标签</li>
<li class="fragment">💭 记录想法和笔记</li>
</ol>

</section>

<section>

## 晚上（10分钟）

<ol>
<li class="fragment">📝 完善今日日记</li>
<li class="fragment">✅ 更新任务完成状态</li>
<li class="fragment">📊 查看 Dashboard 回顾今日</li>
<li class="fragment">🎯 规划明天的任务</li>
</ol>

</section>

</section>

---

<!-- Features Summary -->
<section>

<section class="center">

# ✨ 特色功能

</section>

<section>

## 自动化

<div class="grid grid-2">

<div class="success-box">

### 📝 模板自动应用

在对应文件夹创建文件时
自动应用相应模板

</div>

<div class="success-box">

### 🎯 光标自动跳转

按 Tab 键快速跳转
提高填写效率

</div>

<div class="success-box">

### 📅 智能日期填充

自动填充当前日期
支持多种格式

</div>

<div class="success-box">

### 📊 实时数据更新

Dataview 自动刷新
无需手动维护

</div>

</div>

</section>

<section>

## 可定制性

<div class="two-columns">

<div>

**模板自定义：**
- 修改默认值
- 添加/删除字段
- 调整光标位置
- 更改日期格式

</div>

<div>

**查询自定义：**
- 创建自定义查询
- 调整统计维度
- 定制显示样式
- 添加新的视图

</div>

</div>

</section>

</section>

---

<!-- Results Section -->
<section>

<section class="center">

# 🎯 完成成果

</section>

<section>

## 模板系统

<div class="grid grid-3">

<div class="card">

**📝 日记模板**

- 自动日期
- 心情选项
- 天气地点
- 结构化内容

</div>

<div class="card">

**✅ 待办模板**

- 自动创建日期
- 默认截止日期
- 优先级设置
- 进度追踪

</div>

<div class="card">

**📚 文章模板**

- 标准结构
- SEO 字段
- 标签系统
- 发布日期

</div>

</div>

</section>

<section>

## 查询系统

<div class="highlight-box">

### 📊 完整的示例集合

`template/DATAVIEW-EXAMPLES.md` 包含：
- 📝 30+ 日记查询示例
- ✅ 40+ 待办查询示例
- 📚 20+ 文章查询示例
- 🔄 10+ 综合查询示例
- 📊 15+ 统计分析示例

</div>

</section>

<section>

## 文档系统

| 文档 | 内容 | 字数 |
|------|------|------|
| 🚀 OBSIDIAN-QUICKSTART.md | 快速开始指南 | 1000+ |
| 📚 OBSIDIAN-WORKFLOW.md | 完整工作流 | 9000+ |
| 📊 DATAVIEW-EXAMPLES.md | 查询示例 | 5000+ |
| 🎯 OBSIDIAN-INTEGRATION-SUMMARY.md | 技术总结 | 7000+ |

</section>

</section>

---

<!-- How to Use Section -->
<section>

<section class="center">

# 🎓 如何使用

</section>

<section>

## 创建新内容

<div class="two-columns">

<div>

### 方法 1：自动应用

1. 打开对应文件夹
2. 创建新文件
3. 模板自动应用
4. Tab 键跳转填写

</div>

<div>

### 方法 2：手动插入

1. 创建新文件
2. Ctrl/Cmd + P
3. "Templater: Insert"
4. 选择模板

</div>

</div>

</section>

<section>

## 使用 Dashboard

<ol>
<li class="fragment">打开 <code>template/Dashboard.md</code></li>
<li class="fragment">查看实时统计数据</li>
<li class="fragment">固定到侧边栏</li>
<li class="fragment">每天查看和回顾</li>
</ol>

<div class="fragment small">
💡 建议每天早上查看 Dashboard
</div>

</section>

<section>

## 学习资源

<div class="grid grid-2">

<div>

### 📚 官方文档
- Obsidian 帮助
- Templater 文档
- Dataview 文档

</div>

<div>

### 📖 本地文档
- 快速开始指南
- 完整工作流
- 查询示例集合

</div>

</div>

</section>

</section>

---

<!-- Next Steps Section -->
<section>

<section class="center">

# 🚀 下一步

</section>

<section>

## 立即开始

<ol class="large">
<li class="fragment">📝 在 diary/ 创建第一篇日记</li>
<li class="fragment">✅ 在 todo/ 创建第一个待办</li>
<li class="fragment">📊 打开 Dashboard.md 查看统计</li>
<li class="fragment">📚 浏览 DATAVIEW-EXAMPLES.md</li>
</ol>

</section>

<section>

## 进阶使用

<div class="three-columns">

<div class="card">

**自定义模板**

根据个人需求
修改模板结构

</div>

<div class="card">

**创建查询**

编写自定义
Dataview 查询

</div>

<div class="card">

**优化工作流**

调整为最适合
自己的流程

</div>

</div>

</section>

</section>

---

<!-- Thank You Section -->
<section class="center">

# 🎉 完成！

## Obsidian 插件已完全集成

<div class="fragment">

✅ Templater 模板系统
✅ Dataview 查询引擎
✅ 完整的文档和示例
✅ 开箱即用的工作流

</div>

<div class="fragment">

---

<div class="small">
📧 有问题或建议？欢迎提 Issue

🌟 祝您使用愉快！
</div>

</div>

</section>

<!-- Speaker Notes -->
<aside class="notes">
这是 Obsidian 插件集成的演示文稿。
主要内容包括 Templater 和 Dataview 两个插件的集成说明。
使用键盘方向键导航，按 S 键查看演讲者备注。
</aside>
