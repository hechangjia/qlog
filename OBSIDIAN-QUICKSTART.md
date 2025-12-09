# 🚀 Obsidian 插件适配 - 快速开始

> 5分钟快速上手 Templater 和 Dataview 插件

## ✅ 已完成的配置

### Templater 模板系统
- ✅ 日记模板：`template/diary/templater-template.md`
- ✅ 待办模板：`template/todo/templater-template.md`
- ✅ 文章模板：`template/posts/templater-template.md`
- ✅ 自动应用模板（在对应文件夹创建文件时）
- ✅ 光标自动跳转

### Dataview 查询系统
- ✅ 完整的查询示例：`template/DATAVIEW-EXAMPLES.md`
- ✅ 个人仪表板：`template/Dashboard.md`
- ✅ 支持统计和数据可视化

### Obsidian 配置
- ✅ 模板文件夹：`template/`
- ✅ 文件夹级别的自动模板
- ✅ 日期格式：`YYYY-MM-DD`

## 🎯 立即开始使用

### 1. 创建新日记（30秒）

1. 在 Obsidian 中打开 `diary/` 文件夹
2. 创建新文件（Ctrl/Cmd + N）
3. 模板自动应用！
4. 按 Tab 键在光标位置间跳转填写内容

**示例：**
```
文件名: 2025-12-10-monday-work.md
自动填充: 日期、心情、天气等字段
```

### 2. 创建新待办（30秒）

1. 在 Obsidian 中打开 `todo/` 文件夹
2. 创建新文件
3. 填写任务信息
4. 设置优先级和截止日期

**自动功能：**
- 当前日期作为创建日期
- 7天后的日期作为默认截止日期
- 预设字段结构

### 3. 查看个人仪表板（1分钟）

1. 在 Obsidian 中打开 `template/Dashboard.md`
2. 实时查看：
   - 📅 今日概览
   - ✅ 今日待办
   - ⚠️ 逾期任务
   - 📊 本周统计
   - 🏷️ 标签云

**建议：** 将 Dashboard 固定到侧边栏，每天查看

### 4. 使用 Dataview 查询（2分钟）

在任意笔记中添加查询代码块：

#### 查看本周日记
\`\`\`dataview
TABLE date as "日期", mood as "心情"
FROM "diary"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
\`\`\`

#### 查看未完成任务
\`\`\`dataview
TABLE dueDate as "截止", priority as "优先级"
FROM "todo"
WHERE status != "done"
SORT priority DESC, dueDate ASC
\`\`\`

更多示例请查看 `template/DATAVIEW-EXAMPLES.md`

## 📚 Templater 变量速查

### 常用变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `<% tp.date.now("YYYY-MM-DD") %>` | 当前日期 | 2025-12-09 |
| `<% tp.date.now("HH:mm") %>` | 当前时间 | 14:30 |
| `<% tp.file.cursor(1) %>` | 光标位置1 | - |
| `<% tp.file.title %>` | 文件名 | my-note |
| `<% tp.date.now("YYYY-MM-DD", 7) %>` | 7天后 | 2025-12-16 |

### 日期格式

| 格式 | 输出 |
|------|------|
| `YYYY-MM-DD` | 2025-12-09 |
| `YYYY年MM月DD日` | 2025年12月09日 |
| `HH:mm` | 14:30 |
| `dddd` | Monday |

## 📊 Dataview 查询速查

### 基本查询

```dataview
TABLE field1, field2
FROM "folder"
WHERE condition
SORT field DESC
LIMIT 10
```

### 筛选条件

| 条件 | 说明 | 示例 |
|------|------|------|
| `!draft` | 非草稿 | `WHERE !draft` |
| `status = "done"` | 状态为完成 | `WHERE status = "done"` |
| `date >= date(today)` | 今天或之后 | `WHERE date >= date(today)` |
| `priority = "high"` | 高优先级 | `WHERE priority = "high"` |

### 排序和限制

```dataview
SORT date DESC     # 按日期倒序
SORT priority DESC # 按优先级倒序
LIMIT 10          # 限制10条
```

## 🎯 日常使用流程

### 早晨（5分钟）
1. 打开 Dashboard
2. 查看今日待办
3. 创建今日日记

### 工作中（随时）
1. 创建新待办
2. 更新任务状态
3. 记录想法

### 晚上（10分钟）
1. 完善日记
2. 更新任务进度
3. 规划明天

## 🔗 完整文档

- **详细指南**: `OBSIDIAN-WORKFLOW.md`
- **Dataview 示例**: `template/DATAVIEW-EXAMPLES.md`
- **个人仪表板**: `template/Dashboard.md`

## ❓ 遇到问题？

### 模板没有自动应用？
1. 检查 Templater 插件是否启用
2. 重启 Obsidian
3. 查看 Settings → Templater → Folder Templates

### Dataview 不显示结果？
1. 确认插件已启用
2. 检查 frontmatter 格式
3. 确认 `draft: false`
4. 按 Ctrl/Cmd + R 刷新

---

## ✨ 开始使用

1. ✅ 在 `diary/` 创建第一篇日记
2. ✅ 在 `todo/` 创建第一个待办
3. ✅ 打开 `Dashboard.md` 查看统计
4. ✅ 浏览 `DATAVIEW-EXAMPLES.md` 学习更多

**祝您使用愉快！** 🎉

---

*有问题或建议？欢迎提 Issue！*
