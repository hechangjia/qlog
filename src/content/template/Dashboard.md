# 📊 个人仪表板

> 💡 这是一个使用 Dataview 插件创建的个人仪表板示例

## 📅 今日概览

\`\`\`dataviewjs
const today = dv.date('today');
dv.header(3, today.toFormat('yyyy年MM月dd日 EEEE', 'zh-cn'));

// 今日日记
const todayDiary = dv.pages('"diary"')
  .where(p => !p.draft && dv.date(p.date).equals(today));

if (todayDiary.length > 0) {
  dv.paragraph("✅ **今日日记已记录**");
  todayDiary.forEach(d => {
    dv.paragraph(\`- 心情: \${d.mood || '未记录'} | 天气: \${d.weather || '未记录'}\`);
  });
} else {
  dv.paragraph("❌ **今日日记未记录** - [创建今日日记](#)");
}
\`\`\`

## ✅ 今日待办

\`\`\`dataview
TASK
FROM "todo"
WHERE !completed AND (dueDate = date(today) OR status = "in-progress")
\`\`\`

\`\`\`dataviewjs
const today = dv.date('today');
const todayTodos = dv.pages('"todo"')
  .where(p => !p.draft && p.status != "done" &&
    p.dueDate && dv.date(p.dueDate).equals(today));

if (todayTodos.length > 0) {
  dv.paragraph(\`**今日有 \${todayTodos.length} 项待办**\`);
  dv.table(
    ["任务", "优先级", "进度"],
    todayTodos.map(t => [t.file.link, t.priority, \`\${t.progress}%\`])
  );
} else {
  dv.paragraph("✨ **今日无待办事项**");
}
\`\`\`

## ⚠️ 需要关注

### 逾期任务

\`\`\`dataviewjs
const today = dv.date('today');
const overdue = dv.pages('"todo"')
  .where(p => !p.draft && p.status != "done" &&
    p.dueDate && dv.date(p.dueDate) < today);

if (overdue.length > 0) {
  dv.paragraph(\`⚠️ **有 \${overdue.length} 项逾期任务**\`);
  dv.table(
    ["任务", "截止日期", "优先级"],
    overdue.map(t => [
      t.file.link,
      dv.date(t.dueDate).toFormat('MM-dd'),
      t.priority
    ])
  );
} else {
  dv.paragraph("✅ **无逾期任务**");
}
\`\`\`

### 即将到期 (未来3天)

\`\`\`dataviewjs
const today = dv.date('today');
const threeDaysLater = today + dv.duration('3 days');
const upcoming = dv.pages('"todo"')
  .where(p => !p.draft && p.status != "done" &&
    p.dueDate &&
    dv.date(p.dueDate) > today &&
    dv.date(p.dueDate) <= threeDaysLater);

if (upcoming.length > 0) {
  dv.paragraph(\`📌 **未来3天有 \${upcoming.length} 项任务到期**\`);
  dv.table(
    ["任务", "截止日期", "优先级"],
    upcoming.map(t => [
      t.file.link,
      dv.date(t.dueDate).toFormat('MM-dd'),
      t.priority
    ])
  );
} else {
  dv.paragraph("✨ **未来3天无到期任务**");
}
\`\`\`

## 📊 本周统计

\`\`\`dataviewjs
const today = dv.date('today');
const weekAgo = today - dv.duration('7 days');

// 统计数据
const weekDiaries = dv.pages('"diary"')
  .where(p => !p.draft && p.date >= weekAgo).length;
const weekTodos = dv.pages('"todo"')
  .where(p => !p.draft && p.date >= weekAgo).length;
const weekCompletedTodos = dv.pages('"todo"')
  .where(p => !p.draft && p.status = "done" && p.date >= weekAgo).length;
const weekPosts = dv.pages('"posts"')
  .where(p => !p.draft && p.date >= weekAgo).length;

dv.paragraph(\`
**本周活动概览** (过去7天)

| 类型 | 数量 |
|------|------|
| 📝 日记 | \${weekDiaries} 篇 |
| ✅ 新增待办 | \${weekTodos} 项 |
| ✔️ 完成任务 | \${weekCompletedTodos} 项 |
| 📚 文章 | \${weekPosts} 篇 |
| 🎯 总计 | \${weekDiaries + weekTodos + weekPosts} 项 |
\`);
\`\`\`

## 🎯 本周目标进度

\`\`\`dataviewjs
const allTodos = dv.pages('"todo"').where(p => !p.draft);
const total = allTodos.length;
const completed = allTodos.where(p => p.status === "done").length;
const inProgress = allTodos.where(p => p.status === "in-progress").length;

const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;

dv.paragraph(\`
**整体完成率: \${completionRate}%**

\`\`\`progress
[value: \${completionRate}]
\`\`\`

- ✅ 已完成: \${completed} 项
- 🔄 进行中: \${inProgress} 项
- 📋 待办: \${total - completed - inProgress} 项
\`);
\`\`\`

## 📝 最近内容

### 最近5篇日记

\`\`\`dataview
TABLE date as "日期", mood as "心情", weather as "天气"
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 5
\`\`\`

### 最近5项任务

\`\`\`dataview
TABLE date as "创建", dueDate as "截止", status as "状态", priority as "优先级"
FROM "todo"
WHERE !draft
SORT date DESC
LIMIT 5
\`\`\`

### 最近5篇文章

\`\`\`dataview
TABLE date as "发布日期", tags as "标签"
FROM "posts"
WHERE !draft
SORT date DESC
LIMIT 5
\`\`\`

## 🏷️ 标签云

\`\`\`dataviewjs
const allPages = [
  ...dv.pages('"diary"').where(p => !p.draft),
  ...dv.pages('"todo"').where(p => !p.draft),
  ...dv.pages('"posts"').where(p => !p.draft)
];

const tagCounts = {};

allPages.forEach(p => {
  if (p.tags) {
    const tags = Array.isArray(p.tags) ? p.tags : [p.tags];
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const topTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

if (topTags.length > 0) {
  dv.paragraph("**最常用标签 (Top 10)**");
  dv.table(["标签", "使用次数"], topTags);
} else {
  dv.paragraph("暂无标签");
}
\`\`\`

## 📈 月度趋势

\`\`\`dataviewjs
const allPages = [
  ...dv.pages('"diary"').where(p => !p.draft),
  ...dv.pages('"todo"').where(p => !p.draft),
  ...dv.pages('"posts"').where(p => !p.draft)
];

const monthCounts = {};

allPages.forEach(p => {
  if (p.date) {
    const month = dv.date(p.date).toFormat('yyyy-MM');
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  }
});

const recentMonths = Object.entries(monthCounts)
  .sort((a, b) => b[0].localeCompare(a[0]))
  .slice(0, 6);

if (recentMonths.length > 0) {
  dv.paragraph("**最近6个月内容统计**");
  dv.table(["月份", "内容数"], recentMonths);
}
\`\`\`

---

## 🔗 快速链接

- [[DATAVIEW-EXAMPLES|Dataview 查询示例]]
- [[diary/templater-template|创建新日记]]
- [[todo/templater-template|创建新待办]]
- [[posts/templater-template|创建新文章]]

---

*最后更新: <% tp.date.now("YYYY-MM-DD HH:mm") %>*
