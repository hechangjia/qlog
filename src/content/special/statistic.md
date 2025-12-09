---
title: 数据统计 Dataview 查询
description: 使用 Dataview 查询展示统计数据
---

# Obsidian Dataview 查询示例

以下是使用 Dataview 查询语法执行的实时数据统计。

## 日记统计

### 最近的日记条目
显示最近7天的日记

```dataview
TABLE WITHOUT ID
  file.link AS "日记",
  mood AS "心情",
  weather AS "天气",
  date AS "日期"
FROM "diary"
SORT date DESC
LIMIT 7
```

### 按心情统计
统计不同心情的日记数量

```dataview
TABLE WITHOUT ID
  mood AS "心情",
  length(rows) AS "次数"
FROM "diary"
WHERE mood != null
GROUP BY mood
SORT length(rows) DESC
```

## 待办统计

### 任务完成率
显示任务完成情况

```dataview
TABLE WITHOUT ID
  status AS "状态",
  length(rows) AS "数量",
  round(length(rows) / sum(map(group, (r) => 1)) * 100, 1) + "%" AS "占比"
FROM "todo"
WHERE status != null
GROUP BY status
```

### 逾期任务
显示所有逾期未完成的任务

```dataview
TABLE WITHOUT ID
  file.link AS "任务",
  priority AS "优先级",
  dueDate AS "截止日期",
  category AS "类别"
FROM "todo"
WHERE dueDate < date(today) AND status != "done"
SORT dueDate ASC
```

## 综合统计

### 本月活动统计
统计本月的内容创建情况

```dataview
TABLE WITHOUT ID
  file.folder AS "类型",
  length(rows) AS "数量"
FROM "diary" OR "todo" OR "posts"
WHERE date.month = date(today).month AND date.year = date(today).year
GROUP BY file.folder
SORT length(rows) DESC
```

### 标签使用统计
显示最常用的标签

```dataview
TABLE WITHOUT ID
  choice(tags, "标签", tags) AS "标签",
  length(rows) AS "使用次数"
FROM "diary" OR "todo" OR "posts"
FLATTEN tags
WHERE tags != null
GROUP BY tags
SORT length(rows) DESC
LIMIT 10
```

### 本周创建的内容
显示本周创建的所有内容

```dataview
TABLE WITHOUT ID
  file.link AS "标题",
  file.folder AS "类型",
  date AS "日期"
FROM "diary" OR "todo" OR "posts"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
```
