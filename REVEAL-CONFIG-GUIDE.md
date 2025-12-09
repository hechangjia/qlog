# Reveal.js PPT配置完整指南

本文档说明如何在Obsidian中使用Advanced Slides创建演示文稿，并通过我们的网站以reveal.js格式展示。

## 快速开始

在`src/content/slides/`目录下创建`.md`文件，添加以下frontmatter配置：

```yaml
---
title: "演示文稿标题"
description: "演示文稿描述"
date: 2025-12-09
author: "作者名"
tags: ["标签1", "标签2"]
theme: "sky"
transition: "slide"
---
```

## 完整YAML配置选项

### 基础元数据

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | string | "Untitled Presentation" | 演示标题 |
| `description` | string | "" | 演示描述 |
| `date` | date | 当前日期 | 创建日期 |
| `author` | string | null | 作者姓名 |
| `tags` | array | [] | 标签列表 |
| `draft` | boolean | false | 是否为草稿 |
| `noIndex` | boolean | false | 是否禁止搜索引擎索引 |

### 显示设置 (Display Settings)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | number | 960 | 演示文稿宽度(像素) |
| `height` | number | 700 | 演示文稿高度(像素) |
| `margin` | number | 0.04 | 幻灯片边距(0-1之间) |
| `minScale` | number | 0.2 | 最小缩放比例 |
| `maxScale` | number | 2.0 | 最大缩放比例 |

### 外观设置 (Appearance)

#### theme (主题)
选择演示文稿的视觉主题。

**可选值**:
- `black` - 经典黑色背景
- `white` - 简洁白色背景
- `league` - 蓝灰商务风格
- `beige` - 暖色复古风格
- `sky` - 明亮蓝色主题
- `night` - 深蓝专业主题 ⭐推荐
- `serif` - 优雅衬线字体
- `simple` - 极简主义
- `solarized` - 护眼配色
- `blood` - 红黑高对比
- `moon` - 深蓝月光主题

**默认值**: `black`

#### transition (过渡动画)
幻灯片切换时的过渡效果。

**可选值**:
- `none` - 无过渡
- `fade` - 淡入淡出
- `slide` - 滑动切换 ⭐推荐
- `convex` - 3D凸出效果
- `concave` - 3D凹陷效果
- `zoom` - 缩放效果

**默认值**: `slide`

#### transitionSpeed (过渡速度)
过渡动画的速度。

**可选值**:
- `default` - 默认速度
- `fast` - 快速
- `slow` - 慢速

**默认值**: `default`

#### backgroundTransition (背景过渡)
背景切换时的过渡效果，可选值同`transition`。

**默认值**: `fade`

### 行为设置 (Behavior)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `controls` | boolean | true | 显示导航控件 |
| `controlsTutorial` | boolean | true | 显示控件教程提示 |
| `controlsLayout` | enum | "bottom-right" | 控件位置: `bottom-right`, `edges` |
| `controlsBackArrows` | enum | "faded" | 返回箭头样式: `faded`, `hidden`, `visible` |
| `progress` | boolean | true | 显示进度条 |
| `slideNumber` | boolean | true | 显示幻灯片编号 |
| `showSlideNumber` | enum | "all" | 编号显示位置: `all`, `print`, `speaker` |
| `hashOneBasedIndex` | boolean | false | URL hash使用从1开始的索引 |
| `center` | boolean | true | 幻灯片内容居中 |
| `loop` | boolean | false | 循环播放 |
| `rtl` | boolean | false | 从右到左(RTL)布局 |
| `navigationMode` | enum | "default" | 导航模式: `default`, `linear`, `grid` |
| `shuffle` | boolean | false | 随机播放顺序 |

### 自动播放设置 (Auto-slide)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `autoSlide` | number | 0 | 自动切换间隔(毫秒), 0表示禁用 |
| `autoSlideStoppable` | boolean | true | 用户交互后是否停止自动播放 |

### 鼠标设置 (Mouse)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mouseWheel` | boolean | false | 启用鼠标滚轮导航 |

### 媒体设置 (Media)

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `previewLinks` | boolean | false | 链接预览 |
| `hideAddressBar` | boolean | true | 隐藏地址栏(移动端) |

## 幻灯片结构

### 基础结构

使用HTML `<section>` 标签创建幻灯片：

```html
<section>

# 第一张幻灯片

这是内容

</section>

---

<section>

## 第二张幻灯片

更多内容

</section>
```

### 垂直嵌套

创建垂直导航的幻灯片：

```html
<section>
  <section>
    # 父幻灯片
    按↓键向下导航
  </section>

  <section>
    ## 子幻灯片 1
    这是垂直方向的第一张
  </section>

  <section>
    ## 子幻灯片 2
    这是垂直方向的第二张
  </section>
</section>
```

### Fragment动画

渐进式显示内容：

```html
<section>

## 渐进式显示

<div class="fragment">
第一段内容
</div>

<div class="fragment">
然后显示第二段
</div>

<div class="fragment">
最后显示第三段
</div>

</section>
```

#### Fragment效果

```html
<div class="fragment fade-in">淡入</div>
<div class="fragment fade-out">淡出</div>
<div class="fragment highlight-red">红色高亮</div>
<div class="fragment highlight-blue">蓝色高亮</div>
<div class="fragment grow">放大</div>
<div class="fragment shrink">缩小</div>
```

## 布局系统

### 双栏布局

```html
<div class="two-columns">

<div>
左栏内容
</div>

<div>
右栏内容
</div>

</div>
```

### 三栏布局

```html
<div class="three-columns">
  <div>第一栏</div>
  <div>第二栏</div>
  <div>第三栏</div>
</div>
```

### 网格布局

```html
<div class="grid grid-2">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
  <div class="card">卡片4</div>
</div>

<div class="grid grid-3">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
</div>
```

## 样式化内容框

### 信息框类型

```html
<div class="highlight-box">
💡 重要信息提示
</div>

<div class="warning-box">
⚠️ 警告或注意事项
</div>

<div class="success-box">
✅ 成功消息
</div>

<div class="error-box">
❌ 错误提示
</div>
```

## 演讲者备注

添加只有演讲者能看到的备注：

```html
<section>

## 公开内容

观众看到的幻灯片内容

<aside class="notes">
这是演讲者备注。
- 按 S 键打开演讲者视图
- 备注内容只对演讲者可见
- 可以包含提示和要点
</aside>

</section>
```

## 键盘快捷键

### 导航
- `→` `↓` `Space` - 下一张幻灯片
- `←` `↑` - 上一张幻灯片
- `Home` - 第一张幻灯片
- `End` - 最后一张幻灯片

### 功能
- `F` - 全屏模式
- `S` - 演讲者视图(显示备注)
- `P` - 切换演讲者备注
- `Esc` - 缩略图概览
- `B` / `.` - 暂停/黑屏
- `?` - 显示帮助

### 高级
- `Alt + Click` - 放大区域
- `Ctrl + Shift + F` - 搜索

## Reveal.js API

演示文稿加载后，可以通过浏览器控制台使用Reveal.js API：

### 导航API
```javascript
// 导航到特定幻灯片
Reveal.slide(indexh, indexv);

// 相对导航
Reveal.left();
Reveal.right();
Reveal.up();
Reveal.down();
Reveal.prev();
Reveal.next();

// Fragment导航
Reveal.prevFragment();
Reveal.nextFragment();
```

### 状态查询
```javascript
// 获取当前幻灯片
Reveal.getCurrentSlide();

// 获取幻灯片索引
Reveal.getIndices(); // { h: 0, v: 0, f: 0 }

// 获取总幻灯片数
Reveal.getTotalSlides();

// 获取进度(0-1)
Reveal.getProgress();

// 检查导航方向
Reveal.availableRoutes(); // { top: false, right: true, bottom: false, left: false }
```

### 模式切换
```javascript
// 切换概览模式
Reveal.toggleOverview();

// 切换暂停
Reveal.togglePause();

// 切换帮助
Reveal.toggleHelp();

// 检查状态
Reveal.isOverview();
Reveal.isPaused();
Reveal.isFirstSlide();
Reveal.isLastSlide();
```

## 完整配置示例

```yaml
---
# 基础信息
title: "完整功能演示"
description: "展示所有reveal.js功能"
date: 2025-12-09
author: "Your Name"
tags: ["demo", "tutorial", "reveal.js"]
draft: false

# 显示设置
width: 1920
height: 1080
margin: 0.1
minScale: 0.2
maxScale: 1.5

# 外观
theme: "night"
transition: "slide"
transitionSpeed: "default"
backgroundTransition: "fade"

# 行为
controls: true
controlsTutorial: true
controlsLayout: "bottom-right"
controlsBackArrows: "faded"
progress: true
slideNumber: true
showSlideNumber: "all"
center: true
loop: false
rtl: false
navigationMode: "default"
shuffle: false

# 自动播放
autoSlide: 0
autoSlideStoppable: true

# 鼠标
mouseWheel: false

# 媒体
previewLinks: false
hideAddressBar: true
---

<!-- 演示内容从这里开始 -->
<section class="center">

# 欢迎使用Reveal.js

</section>
```

## 最佳实践

### 内容设计
- ✅ 每张幻灯片一个核心观点
- ✅ 使用fragment实现渐进式展示
- ✅ 合理使用视觉元素和布局
- ✅ 保持文字简洁清晰
- ✅ 统一的视觉风格

### 技术准备
- 📱 测试不同设备和浏览器
- 🎤 准备演讲者备注
- 💾 确保本地备份
- 🔗 提前分享访问链接
- ⌨️ 熟悉快捷键操作

## 故障排除

### 幻灯片不显示
1. 检查`<section>`标签是否正确闭合
2. 验证frontmatter语法
3. 确认主题名称拼写正确
4. 打开浏览器控制台查看错误

### 样式不正确
1. 检查CSS类名拼写
2. 验证HTML结构
3. 确认reveal.js CDN资源加载成功

### 导航问题
1. 测试键盘快捷键
2. 检查幻灯片嵌套结构
3. 查看浏览器控制台日志

## 资源链接

- [Reveal.js官方文档](https://revealjs.com/)
- [Reveal.js API文档](https://revealjs.com/api/)
- [Advanced Slides GitHub](https://github.com/MSzturc/obsidian-advanced-slides)
- 本地模板: `src/content/template/slides/templater-template.md`
- 示例演示: `/slides/advanced-slides-tutorial`

---

*使用愉快！创建精彩的演示文稿！* 🎉
