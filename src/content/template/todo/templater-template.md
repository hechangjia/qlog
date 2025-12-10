---
title: "<% tp.file.title %>"
description: "<% tp.file.cursor(1) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
dueDate: <% tp.date.now("YYYY-MM-DD", 7) %>
priority: <% tp.system.suggester(["High (高)", "Medium (中)", "Low (低)"], ["high", "medium", "low"]) %>
status: <% tp.system.suggester(["Todo (待办)", "In Progress (进行中)", "Done (已完成)"], ["todo", "in-progress", "done"]) %>
category: ""
tags: []
estimatedTime: ""
progress: 0
draft: false
---

# <% tp.file.title %>

## 📋 任务描述

<% tp.file.cursor(2) %>

## 🎯 目标

<% tp.file.cursor(3) %>

## ✅ 任务清单

- [ ] <% tp.file.cursor(4) %>
- [ ]
- [ ]

## 📝 备注

<% tp.file.cursor(5) %>

## 📊 进度追踪

**创建时间**: <% tp.date.now("YYYY-MM-DD HH:mm") %>
**截止日期**: <% tp.date.now("YYYY-MM-DD", 7) %>
**优先级**: 中等
**预计耗时**: <% tp.file.cursor(6) %>
**当前进度**: 0%

---

> 💡 提示：记得定期更新进度和状态