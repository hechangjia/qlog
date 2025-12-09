---
title: 待办任务 Dataview 查询
description: 使用 Dataview 查询展示任务进度和统计
---

# 任务进度 & Dataview 查询

以下是使用 Dataview 查询语法执行的实时任务统计和进度追踪。

## 任务清单

### 高优先级任务
显示所有高优先级的待办任务

```dataview
TABLE WITHOUT ID
  file.link AS "任务",
  status AS "状态",
  dueDate AS "截止日期",
  category AS "类别"
FROM "todo"
WHERE priority = "high" AND status != "done"
SORT dueDate ASC
LIMIT 10
```

### 进行中的任务
显示当前正在进行的任务

```dataview
TABLE WITHOUT ID
  file.link AS "任务",
  priority AS "优先级",
  progress AS "进度",
  date AS "开始日期"
FROM "todo"
WHERE status = "in-progress"
SORT priority DESC, date DESC
```

### 即将到期的任务
显示未来7天内到期的任务

```dataview
TABLE WITHOUT ID
  file.link AS "任务",
  status AS "状态",
  priority AS "优先级",
  dueDate AS "截止日期"
FROM "todo"
WHERE dueDate >= date(today) AND dueDate <= date(today) + dur(7 days) AND status != "done"
SORT dueDate ASC
```

### 最近完成的任务
显示最近完成的5个任务

```dataview
TABLE WITHOUT ID
  file.link AS "任务",
  priority AS "优先级",
  category AS "类别",
  date AS "完成日期"
FROM "todo"
WHERE status = "done"
SORT date DESC
LIMIT 5
```

## 任务统计

### 按类别统计任务
统计不同类别的任务数量

```dataview
TABLE WITHOUT ID
  category AS "类别",
  length(rows) AS "任务数",
  length(filter(rows, (r) => r.status = "done")) AS "已完成",
  length(filter(rows, (r) => r.status = "in-progress")) AS "进行中",
  length(filter(rows, (r) => r.status = "todo")) AS "待办"
FROM "todo"
WHERE category != null
GROUP BY category
SORT length(rows) DESC
```

### 按优先级统计任务
统计不同优先级的任务数量

```dataview
TABLE WITHOUT ID
  priority AS "优先级",
  length(rows) AS "总数",
  length(filter(rows, (r) => r.status = "done")) AS "已完成",
  length(filter(rows, (r) => r.status != "done")) AS "未完成"
FROM "todo"
WHERE priority != null
GROUP BY priority
SORT priority ASC
```
