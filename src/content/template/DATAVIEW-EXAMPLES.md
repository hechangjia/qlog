# 📊 Dataview 查询示例

本文档提供在 Obsidian 中使用 Dataview 插件查询日记、待办和文章的示例。

## 📝 日记查询

### 查看所有日记（按日期倒序）

\`\`\`dataview
TABLE date as "日期", mood as "心情", weather as "天气", location as "地点"
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 20
\`\`\`

### 按心情筛选日记

\`\`\`dataview
TABLE date as "日期", title as "标题", weather as "天气"
FROM "diary"
WHERE mood = "happy" AND !draft
SORT date DESC
\`\`\`

### 查看本周日记

\`\`\`dataview
TABLE date as "日期", mood as "心情", tags as "标签"
FROM "diary"
WHERE date >= date(today) - dur(7 days) AND !draft
SORT date DESC
\`\`\`

### 心情统计

\`\`\`dataview
TABLE WITHOUT ID
  mood as "心情",
  length(rows) as "次数"
FROM "diary"
WHERE !draft
GROUP BY mood
SORT length(rows) DESC
\`\`\`

### 按地点分组

\`\`\`dataview
TABLE WITHOUT ID
  location as "地点",
  rows.file.link as "日记",
  length(rows) as "次数"
FROM "diary"
WHERE location != "" AND !draft
GROUP BY location
SORT length(rows) DESC
\`\`\`

## ✅ 待办查询

### 查看所有待办（按优先级和日期）

\`\`\`dataview
TABLE date as "创建日期", dueDate as "截止日期", priority as "优先级", status as "状态", progress as "进度"
FROM "todo"
WHERE !draft
SORT priority DESC, dueDate ASC
\`\`\`

### 未完成的高优先级任务

\`\`\`dataview
TABLE dueDate as "截止日期", category as "分类", progress as "进度%"
FROM "todo"
WHERE priority = "high" AND status != "done" AND !draft
SORT dueDate ASC
\`\`\`

### 逾期任务

\`\`\`dataview
TABLE dueDate as "截止日期", priority as "优先级", status as "状态"
FROM "todo"
WHERE dueDate < date(today) AND status != "done" AND !draft
SORT dueDate ASC
\`\`\`

### 本周到期任务

\`\`\`dataview
TABLE dueDate as "截止日期", priority as "优先级", progress as "进度"
FROM "todo"
WHERE dueDate >= date(today) AND dueDate <= date(today) + dur(7 days) AND status != "done" AND !draft
SORT dueDate ASC
\`\`\`

### 进行中的任务

\`\`\`dataview
TABLE date as "开始日期", dueDate as "截止日期", progress as "进度%", estimatedTime as "预计耗时"
FROM "todo"
WHERE status = "in-progress" AND !draft
SORT progress DESC
\`\`\`

### 按分类统计任务

\`\`\`dataview
TABLE WITHOUT ID
  category as "分类",
  length(rows) as "总数",
  length(filter(rows, (r) => r.status = "done")) as "已完成",
  length(filter(rows, (r) => r.status = "in-progress")) as "进行中",
  length(filter(rows, (r) => r.status = "todo")) as "待办"
FROM "todo"
WHERE category != "" AND !draft
GROUP BY category
SORT length(rows) DESC
\`\`\`

### 完成率统计

\`\`\`dataviewjs
const todos = dv.pages('"todo"').where(p => !p.draft);
const total = todos.length;
const completed = todos.where(p => p.status === "done").length;
const inProgress = todos.where(p => p.status === "in-progress").length;
const todo = todos.where(p => p.status === "todo").length;

dv.header(3, "📊 待办统计");
dv.paragraph(\`
- **总任务数**: \${total}
- **已完成**: \${completed} (\${Math.round(completed/total*100)}%)
- **进行中**: \${inProgress} (\${Math.round(inProgress/total*100)}%)
- **待办**: \${todo} (\${Math.round(todo/total*100)}%)
\`);
\`\`\`

## 📚 文章查询

### 查看所有文章（按日期倒序）

\`\`\`dataview
TABLE date as "日期", tags as "标签", description as "描述"
FROM "posts"
WHERE !draft
SORT date DESC
LIMIT 20
\`\`\`

### 按标签筛选文章

\`\`\`dataview
TABLE date as "日期", description as "描述"
FROM "posts"
WHERE contains(tags, "tutorial") AND !draft
SORT date DESC
\`\`\`

### 最近发布的文章

\`\`\`dataview
TABLE date as "发布日期", tags as "标签"
FROM "posts"
WHERE date >= date(today) - dur(30 days) AND !draft
SORT date DESC
\`\`\`

### 标签使用统计

\`\`\`dataviewjs
const pages = dv.pages('"posts"').where(p => !p.draft);
const tagCounts = {};

pages.forEach(p => {
  if (p.tags) {
    p.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sortedTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

dv.header(3, "🏷️ 最常用标签 (Top 10)");
dv.table(["标签", "使用次数"], sortedTags);
\`\`\`

## 🔄 综合查询

### 最近的所有内容

\`\`\`dataviewjs
const allContent = [];

// 获取日记
dv.pages('"diary"').where(p => !p.draft).forEach(p => {
  allContent.push({
    type: "📝 日记",
    title: p.title,
    date: p.date,
    link: p.file.link
  });
});

// 获取待办
dv.pages('"todo"').where(p => !p.draft).forEach(p => {
  allContent.push({
    type: "✅ 待办",
    title: p.title,
    date: p.date,
    link: p.file.link
  });
});

// 获取文章
dv.pages('"posts"').where(p => !p.draft).forEach(p => {
  allContent.push({
    type: "📚 文章",
    title: p.title,
    date: p.date,
    link: p.file.link
  });
});

// 按日期排序
allContent.sort((a, b) => b.date - a.date);

dv.header(3, "📋 最近内容 (Top 20)");
dv.table(
  ["类型", "标题", "日期"],
  allContent.slice(0, 20).map(c => [c.type, c.link, c.date])
);
\`\`\`

### 本周活动总览

\`\`\`dataviewjs
const weekAgo = dv.date('today') - dv.duration('7 days');

const diaries = dv.pages('"diary"')
  .where(p => !p.draft && p.date >= weekAgo).length;
const todos = dv.pages('"todo"')
  .where(p => !p.draft && p.date >= weekAgo).length;
const posts = dv.pages('"posts"')
  .where(p => !p.draft && p.date >= weekAgo).length;

dv.header(3, "📊 本周活动");
dv.paragraph(\`
- 📝 日记: \${diaries} 篇
- ✅ 待办: \${todos} 项
- 📚 文章: \${posts} 篇
- 🎯 总计: \${diaries + todos + posts} 项
\`);
\`\`\`

### 内容数量统计（按月）

\`\`\`dataviewjs
const allPages = [
  ...dv.pages('"diary"').where(p => !p.draft),
  ...dv.pages('"todo"').where(p => !p.draft),
  ...dv.pages('"posts"').where(p => !p.draft)
];

const monthCounts = {};

allPages.forEach(p => {
  const month = dv.date(p.date).toFormat('yyyy-MM');
  monthCounts[month] = (monthCounts[month] || 0) + 1;
});

const sorted = Object.entries(monthCounts)
  .sort((a, b) => b[0].localeCompare(a[0]))
  .slice(0, 12);

dv.header(3, "📈 每月内容统计 (最近12个月)");
dv.table(["月份", "内容数"], sorted);
\`\`\`

## 💡 高级用法

### 创建个人仪表板

在 Obsidian 中创建一个 `Dashboard.md` 文件，包含以下查询：

\`\`\`dataviewjs
// 今日概览
dv.header(2, "📅 今日概览 - " + dv.date('today').toFormat('yyyy-MM-dd'));

// 今日日记
const todayDiary = dv.pages('"diary"')
  .where(p => !p.draft && dv.date(p.date).equals(dv.date('today')));
dv.paragraph(\`📝 今日日记: \${todayDiary.length > 0 ? '✅ 已记录' : '❌ 未记录'}\`);

// 今日待办
const todayTodos = dv.pages('"todo"')
  .where(p => !p.draft && p.status != "done" &&
    (dv.date(p.dueDate)?.equals(dv.date('today')) || false));
dv.paragraph(\`✅ 今日待办: \${todayTodos.length} 项\`);
if (todayTodos.length > 0) {
  dv.list(todayTodos.map(t => t.file.link));
}

// 逾期任务
const overdueTodos = dv.pages('"todo"')
  .where(p => !p.draft && p.status != "done" &&
    p.dueDate && dv.date(p.dueDate) < dv.date('today'));
if (overdueTodos.length > 0) {
  dv.header(3, "⚠️ 逾期任务");
  dv.list(overdueTodos.map(t => t.file.link));
}

// 本周统计
const weekAgo = dv.date('today') - dv.duration('7 days');
const weekDiaries = dv.pages('"diary"').where(p => !p.draft && p.date >= weekAgo).length;
const weekTodos = dv.pages('"todo"').where(p => !p.draft && p.status = "done" && p.date >= weekAgo).length;

dv.header(3, "📊 本周统计");
dv.paragraph(\`
- 📝 写了 \${weekDiaries} 篇日记
- ✅ 完成了 \${weekTodos} 项任务
\`);
\`\`\`

## 📖 使用建议

1. **创建专属仪表板**: 在 Obsidian 中创建一个 Dashboard 文件，使用上述查询创建个性化的数据面板
2. **定期回顾**: 使用 Dataview 查询回顾过去一周/一个月的内容
3. **任务管理**: 使用 Dataview 查询管理待办事项，追踪进度
4. **内容分析**: 使用统计查询分析写作习惯和内容分布
5. **标签管理**: 定期查看标签使用情况，优化标签系统

## 🔗 相关资源

- [Dataview 官方文档](https://blacksmithgu.github.io/obsidian-dataview/)
- [Dataview 示例库](https://github.com/blacksmithgu/obsidian-dataview)

---

*提示：将此文件放在 Obsidian 笔记中，所有 Dataview 代码块会自动执行并显示结果！*
