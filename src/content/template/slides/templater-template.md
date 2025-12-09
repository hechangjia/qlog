---
title: "<% tp.file.cursor(1) %>"
description: "<% tp.file.cursor(2) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
author: "<% tp.file.cursor(3) %>"
tags: [<% tp.file.cursor(4) %>]
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

# <% tp.file.cursor(5) %>

## <% tp.file.cursor(6) %>

> <% tp.file.cursor(7) %>

<div class="small">
作者: <% tp.file.cursor(8) %> | 日期: <% tp.date.now("YYYY-MM-DD") %>
</div>

</section>

---

<!-- Overview Slide -->
<section>

## 📋 概览

<div class="fragment">

<% tp.file.cursor(9) %>

</div>

<div class="fragment">

<% tp.file.cursor(10) %>

</div>

</section>

---

<!-- Section 1 -->
<section>

<section class="center">

# <% tp.file.cursor(11) %>

</section>

<section>

## <% tp.file.cursor(12) %>

<% tp.file.cursor(13) %>

</section>

</section>

---

<!-- Section 2 -->
<section>

<section class="center">

# <% tp.file.cursor(14) %>

</section>

<section>

## <% tp.file.cursor(15) %>

<div class="two-columns">

<div>

<% tp.file.cursor(16) %>

</div>

<div>

<% tp.file.cursor(17) %>

</div>

</div>

</section>

</section>

---

<!-- Thank You Slide -->
<section class="center">

# 🎉 谢谢！

<div class="fragment">

<% tp.file.cursor(18) %>

</div>

<div class="fragment">

---

<div class="small">
📧 有问题或建议？欢迎交流

🌟 感谢观看！
</div>

</div>

</section>

<!-- Speaker Notes -->
<aside class="notes">
演讲者备注：
- 使用方向键导航幻灯片
- 按 S 键查看演讲者备注
- 按 F 键进入全屏模式
- 按 Esc 键查看缩略图
</aside>

<!--
使用指南：
====================

## Reveal.js 幻灯片语法

### 水平分隔（新幻灯片）
使用 --- 创建新的水平幻灯片

### 垂直分隔（子幻灯片）
使用 -- 创建垂直子幻灯片（向下导航）

### 居中幻灯片
<section class="center">
  内容居中显示
</section>

### 渐进显示（Fragment）
<div class="fragment">
  逐步显示的内容
</div>

### 双栏布局
<div class="two-columns">
  <div>左栏</div>
  <div>右栏</div>
</div>

### 三栏布局
<div class="three-columns">
  <div>第一栏</div>
  <div>第二栏</div>
  <div>第三栏</div>
</div>

### 网格布局
<div class="grid grid-2">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
</div>

### 样式框
<div class="highlight-box">高亮信息</div>
<div class="warning-box">警告信息</div>
<div class="success-box">成功信息</div>
<div class="error-box">错误信息</div>

### 代码块
```javascript
const example = "代码示例";
console.log(example);
```

### 演讲者备注
<aside class="notes">
  只有演讲者能看到的备注
</aside>

## 主题选择
可用主题：black, white, league, beige, sky, night, serif, simple, solarized, blood, moon

## 过渡效果
可用过渡：none, fade, slide, convex, concave, zoom

## 键盘快捷键
- → / ← : 水平导航
- ↑ / ↓ : 垂直导航
- Esc : 缩略图视图
- F : 全屏模式
- S : 演讲者备注
- B : 暂停（黑屏）
- ? : 显示帮助

====================
-->
