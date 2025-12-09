---
title: "测试"
description: "实现日记、待办、统计和年度总结功能"
date: 2025-12-10
dueDate: 2025-12-25
priority: low
status: in-progress
category: "开发"
tags: ["项目", "编程", "重要"]
estimatedTime: "16小时"
progress: 33
draft: false
---
- [ ] 测试集
- [ ] s参加了
- [ ]  就踹了
> [!note]+ dajiahao
> - [ ] kls
> - [ ] kfks
> - [ ] fska

![[todo.base]]



```dataview
TABLE mood as "心情"
FROM "diary"
WHERE mood
GROUP BY mood
SORT mood ASC
```

