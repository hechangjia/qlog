# 🗂️ Obsidian 工作流完整指南

> 使用 Obsidian 作为 CMS，配合 Templater 和 Dataview 插件管理您的日记、待办和博客

## 📚 目录

1. [快速开始](#快速开始)
2. [Templater 使用指南](#templater-使用指南)
3. [Dataview 使用指南](#dataview-使用指南)
4. [工作流最佳实践](#工作流最佳实践)
5. [常见问题](#常见问题)

---

## 🚀 快速开始

### 前置要求

确保已安装以下 Obsidian 插件：
- ✅ **Templater** - 用于创建动态模板
- ✅ **Dataview** - 用于数据查询和统计

### 文件结构

```
src/content/
├── diary/                 # 日记目录
├── todo/                  # 待办事项目录
├── posts/                 # 博客文章目录
└── template/              # 模板目录
    ├── diary/
    │   └── templater-template.md
    ├── todo/
    │   └── templater-template.md
    ├── posts/
    │   └── templater-template.md
    ├── Dashboard.md       # 个人仪表板
    └── DATAVIEW-EXAMPLES.md  # Dataview 示例
```

---

## 📝 Templater 使用指南

### 什么是 Templater？

Templater 是一个强大的模板插件，可以：
- 🔄 自动填充日期和时间
- 📋 使用动态变量
- ✨ 光标位置占位符
- 🎯 文件夹级别的自动模板

### 配置说明

Templater 已配置为：
- ✅ 模板文件夹：`template/`
- ✅ 创建文件时自动触发模板
- ✅ 自动跳转到光标位置
- ✅ 文件夹模板已设置：
  - `diary/` → `template/diary/templater-template.md`
  - `todo/` → `template/todo/templater-template.md`
  - `posts/` → `template/posts/templater-template.md`

### 创建新内容

#### 方法 1：在指定文件夹创建（推荐）

1. 在 Obsidian 中导航到对应文件夹（diary/todo/posts）
2. 创建新文件
3. Templater 会自动应用对应的模板
4. 按 Tab 键在光标位置间跳转，填写内容

#### 方法 2：手动插入模板

1. 创建新文件
2. 按 `Ctrl/Cmd + P` 打开命令面板
3. 搜索 "Templater: Insert Template"
4. 选择对应的模板文件

### 模板变量说明

#### 日记模板变量

```markdown
---
title: "<% tp.date.now("YYYY-MM-DD") %> 日记"
date: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.date.now("YYYY年MM月DD日") %>
```

**可用变量：**
- `<% tp.date.now("格式") %>` - 当前日期/时间
- `<% tp.file.cursor(n) %>` - 光标位置占位符（n为编号）
- `<% tp.file.title %>` - 当前文件名

#### 待办模板变量

```markdown
---
dueDate: <% tp.date.now("YYYY-MM-DD", 7) %>
---
```

**说明：**
- `tp.date.now("YYYY-MM-DD", 7)` - 7天后的日期
- 可以修改数字来设置不同的默认截止日期

### 自定义模板

您可以编辑 `template/` 目录下的模板文件来自定义：
- 默认值
- 字段结构
- 光标位置
- 日期格式

**日期格式参考：**
- `YYYY` - 4位年份（2025）
- `MM` - 2位月份（01-12）
- `DD` - 2位日期（01-31）
- `HH` - 24小时制小时（00-23）
- `mm` - 分钟（00-59）
- `dddd` - 星期几（Monday）

**中文日期示例：**
```
<% tp.date.now("YYYY年MM月DD日 dddd", "YYYY-MM-DD", "zh-cn") %>
```

---

## 📊 Dataview 使用指南

### 什么是 Dataview？

Dataview 将您的笔记库转换为数据库，可以：
- 📋 查询和筛选笔记
- 📊 统计和聚合数据
- 📈 创建动态视图
- 🎯 构建个人仪表板

### 基本语法

#### TABLE 查询

```dataview
TABLE date, mood, weather
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 10
```

#### LIST 查询

```dataview
LIST
FROM "todo"
WHERE status = "in-progress"
SORT priority DESC
```

#### DataviewJS（高级）

```dataviewjs
const todos = dv.pages('"todo"').where(p => !p.draft);
dv.paragraph(`总共有 ${todos.length} 个待办事项`);
```

### 常用查询示例

#### 1. 今日任务

```dataview
TABLE dueDate as "截止日期", priority as "优先级"
FROM "todo"
WHERE dueDate = date(today) AND status != "done"
SORT priority DESC
```

#### 2. 本周日记

```dataview
TABLE date as "日期", mood as "心情"
FROM "diary"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
```

#### 3. 逾期任务

```dataview
TABLE dueDate as "截止日期", title as "任务"
FROM "todo"
WHERE dueDate < date(today) AND status != "done"
SORT dueDate ASC
```

#### 4. 标签统计

```dataviewjs
const pages = dv.pages('"posts"');
const tagCounts = {};

pages.forEach(p => {
  if (p.tags) {
    p.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

dv.table(["标签", "次数"], sorted);
```

### 创建个人仪表板

1. 复制 `template/Dashboard.md` 到您的笔记根目录
2. 在 Obsidian 中打开
3. 所有 Dataview 查询会自动执行并显示结果
4. 可以自定义查询来满足您的需求

**建议：**
- 📌 固定 Dashboard 到侧边栏
- ⏰ 每天早上查看
- 📊 定期回顾统计数据
- ✏️ 根据需要修改查询

更多查询示例，请查看 `template/DATAVIEW-EXAMPLES.md`

---

## 💡 工作流最佳实践

### 日常工作流

#### 早晨（5分钟）

1. 📊 打开 Dashboard 查看今日概览
2. ✅ 查看今日待办和逾期任务
3. 📝 创建新的日记（自动套用模板）
4. 📌 标记重要任务

#### 工作时（随时）

1. ✅ 在 `todo/` 文件夹创建新待办
2. 📝 更新任务状态和进度
3. 🏷️ 添加合适的标签

#### 晚上（10分钟）

1. 📝 完善今日日记
2. ✅ 更新任务完成状态
3. 📊 查看 Dashboard 回顾今日
4. 🎯 规划明天的任务

#### 周末（30分钟）

1. 📈 使用 Dataview 查看本周统计
2. 📚 撰写博客文章（在 `posts/` 文件夹）
3. 🗑️ 清理已完成的旧任务
4. 🎯 规划下周目标

### 文件命名规范

#### 日记
```
YYYY-MM-DD-简短描述.md
例如: 2025-12-09-beautiful-day.md
```

#### 待办
```
YYYY-MM-任务名称.md
例如: 2025-12-qlog-development.md
```

#### 文章
```
kebab-case-title.md
例如: getting-started-with-astro.md
```

### 标签使用建议

#### 日记标签
- 📍 地点：`#家`, `#公司`, `#旅行`
- 🎯 活动：`#工作`, `#学习`, `#运动`, `#社交`
- 💭 主题：`#反思`, `#目标`, `#感悟`

#### 待办标签
- 📁 分类：`#工作`, `#个人`, `#学习`, `#健康`
- 🎯 项目：`#项目名称`, `#xxx功能`
- 🏷️ 类型：`#bug`, `#feature`, `#改进`

#### 文章标签
- 📚 主题：`#技术`, `#生活`, `#思考`
- 🔧 技术：`#javascript`, `#astro`, `#obsidian`
- 🎯 分类：`#教程`, `#笔记`, `#总结`

### Frontmatter 最佳实践

#### 必填字段
```yaml
---
title: "标题"
date: YYYY-MM-DD
description: "简短描述"
draft: false
---
```

#### 日记推荐字段
```yaml
---
title: "日记标题"
date: 2025-12-09
mood: happy  # happy/sad/neutral/excited/tired/stressed/peaceful
weather: "☀️"
location: "北京"
tags: ["生活", "周末"]
draft: false
---
```

#### 待办推荐字段
```yaml
---
title: "任务名称"
date: 2025-12-09
dueDate: 2025-12-15
priority: high  # high/medium/low
status: todo  # todo/in-progress/done
category: "工作"
progress: 0
estimatedTime: "2小时"
draft: false
---
```

---

## ❓ 常见问题

### Q: 模板没有自动应用？

**A:** 检查以下设置：
1. 确认 Templater 插件已启用
2. 检查 Settings → Templater → Folder Templates 配置
3. 确认 "Trigger Templater on new file creation" 已开启
4. 重启 Obsidian

### Q: Dataview 查询不显示结果？

**A:** 常见原因：
1. 确认 Dataview 插件已启用
2. 检查文件的 frontmatter 格式是否正确
3. 确认 `draft: false`
4. 检查日期格式是否为 `YYYY-MM-DD`
5. 刷新 Dataview（Ctrl/Cmd + R）

### Q: 如何备份我的笔记？

**A:** 推荐方案：
1. 使用 Obsidian Git 插件自动同步到 GitHub
2. 使用第三方云同步（Dropbox/iCloud）
3. 定期手动备份整个 vault

### Q: 可以在移动设备使用吗？

**A:** 可以！
1. Obsidian 有 iOS 和 Android 版本
2. Templater 和 Dataview 在移动端完全可用
3. 建议通过 Git 或云同步保持多设备同步

### Q: 如何自定义模板？

**A:** 编辑 `template/` 目录下的模板文件：
1. 修改默认值
2. 添加/删除字段
3. 调整光标位置
4. 保存即可生效

### Q: 日期和时间不对？

**A:** 检查 Templater 设置：
1. Settings → Templater → Template folder path
2. 确认日期格式设置正确
3. 如果需要中文日期，使用 `"zh-cn"` locale

### Q: 如何导出笔记到网站？

**A:** 自动流程：
1. 在 Obsidian 中编辑内容
2. 使用 Git 同步到仓库
3. Astro 构建时自动处理
4. 发布到网站

---

## 🔗 相关资源

### 官方文档
- [Obsidian 官方文档](https://help.obsidian.md/)
- [Templater 文档](https://silentvoid13.github.io/Templater/)
- [Dataview 文档](https://blacksmithgu.github.io/obsidian-dataview/)

### 模板文件
- `template/diary/templater-template.md` - 日记模板
- `template/todo/templater-template.md` - 待办模板
- `template/posts/templater-template.md` - 文章模板
- `template/Dashboard.md` - 仪表板
- `template/DATAVIEW-EXAMPLES.md` - Dataview 示例

### 推荐插件
- 📊 **Dataview** - 数据查询
- 📝 **Templater** - 动态模板
- 🔄 **Obsidian Git** - 版本控制
- 🎨 **Editor Toolbar** - 编辑工具栏
- 📅 **Calendar** - 日历视图

---

## 🎯 下一步

1. ✅ 熟悉 Templater 模板使用
2. ✅ 尝试 Dataview 查询
3. ✅ 创建个人 Dashboard
4. ✅ 建立日常工作流习惯
5. ✅ 根据需要自定义模板和查询

---

**💡 提示：** 将此文档保存到您的 Obsidian vault 中，随时查阅！

**📧 反馈：** 如有问题或建议，欢迎在 GitHub 提 Issue。

---

*最后更新: 2025-12-09*
*版本: 1.0*
