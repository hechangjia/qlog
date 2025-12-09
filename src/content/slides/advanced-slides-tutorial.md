---
title: "Advanced Slides 完整教程"
description: "使用 Obsidian Advanced Slides 和 Reveal.js 创建精美演示文稿"
date: 2025-12-09
author: "Claude Code"
tags: ["obsidian", "advanced-slides", "reveal.js", "presentation", "demo"]
theme: "sky"
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

# 📊 Advanced Slides 教程

## 用 Markdown 创建精美演示

> 从 Obsidian 到 Web 的完整工作流

<div class="small">
作者: Claude Code | 日期: 2025-12-09
</div>

</section>

---

<!-- What is Advanced Slides -->
<section>

## 🤔 什么是 Advanced Slides？

<div class="fragment">

**Advanced Slides** 是 Obsidian 插件：
- 📝 用 Markdown 写演示文稿
- 🎨 使用 Reveal.js 渲染
- 🌐 发布到 Web
- 💻 支持代码高亮

</div>

<div class="fragment">

**优势**: 笔记即演示，演示即笔记！

</div>

</section>

---

<!-- Basic Structure -->
<section>

<section class="center">

# 📐 基础结构

</section>

<section>

## Frontmatter 配置

```yaml
---
title: "我的演示"
theme: "night"
transition: "slide"
controls: true
progress: true
slideNumber: true
---
```

<div class="fragment">

配置演示文稿的外观和行为

</div>

</section>

<section>

## 幻灯片分隔

<div class="two-columns">

<div>

**水平分隔 `---`**

```markdown
<section>
内容1
</section>

---

<section>
内容2
</section>
```

</div>

<div>

**垂直分隔（嵌套）**

```markdown
<section>
  <section>
    父幻灯片
  </section>

  <section>
    子幻灯片
  </section>
</section>
```

</div>

</div>

</section>

<section>

## 基本内容

```markdown
<section>

## 标题

段落文本

- 列表项 1
- 列表项 2

</section>
```

<div class="fragment">

支持所有标准 Markdown 语法！

</div>

</section>

</section>

---

<!-- Themes -->
<section>

<section class="center">

# 🎨 主题选择

11 种内置主题

</section>

<section>

## 可用主题

<div class="grid grid-3">

<div class="card">
**night** ⭐
深色专业
</div>

<div class="card">
**black**
经典黑色
</div>

<div class="card">
**white**
简洁白色
</div>

<div class="card">
**league**
蓝灰商务
</div>

<div class="card">
**beige**
暖色复古
</div>

<div class="card">
**sky**
明亮蓝色
</div>

<div class="card">
**serif**
优雅衬线
</div>

<div class="card">
**simple**
极简主义
</div>

<div class="card">
**solarized**
护眼配色
</div>

<div class="card">
**blood**
红黑对比
</div>

<div class="card">
**moon**
深蓝月光
</div>

</div>

</section>

<section>

## 主题切换

在 frontmatter 中更改：

```yaml
theme: "sky"
```

<div class="fragment">

**当前主题**: sky (明亮蓝色) ☀️

</div>

<div class="fragment">

**提示**: 尝试不同主题，找到最适合的！

</div>

</section>

</section>

---

<!-- Transitions -->
<section>

<section class="center">

# ✨ 过渡动画

</section>

<section>

## 可用过渡

<div class="grid grid-2">

<div class="card">
**slide** (滑动)
最常用
</div>

<div class="card">
**fade** (淡入)
平滑优雅
</div>

<div class="card">
**convex** (凸出)
3D 效果
</div>

<div class="card">
**concave** (凹陷)
3D 内凹
</div>

<div class="card">
**zoom** (缩放)
放大缩小
</div>

<div class="card">
**none** (无)
瞬间切换
</div>

</div>

</section>

<section>

## 配置过渡

```yaml
transition: "slide"
backgroundTransition: "fade"
```

<div class="fragment">

- `transition` - 幻灯片切换效果
- `backgroundTransition` - 背景切换效果

</div>

</section>

</section>

---

<!-- Fragments -->
<section>

<section class="center">

# 🎭 Fragment 动画

渐进式内容展示

</section>

<section>

## 基础 Fragment

```html
<div class="fragment">
第一段出现
</div>

<div class="fragment">
然后第二段
</div>

<div class="fragment">
最后第三段
</div>
```

<div class="fragment">
👆 像这样！
</div>
<div class="fragment">
👆 一步一步！
</div>
<div class="fragment">
👆 显示内容！
</div>

</section>

<section>

## Fragment 效果

<div class="two-columns">

<div>

**淡入淡出**
```html
<div class="fragment fade-in">
淡入
</div>

<div class="fragment fade-out">
淡出
</div>
```

</div>

<div>

**高亮**
```html
<div class="fragment highlight-red">
红色高亮
</div>

<div class="fragment highlight-blue">
蓝色高亮
</div>
```

</div>

</div>

</section>

</section>

---

<!-- Layouts -->
<section>

<section class="center">

# 📐 布局系统

</section>

<section>

## 双栏布局

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

<div class="two-columns">

<div class="fragment">
📝 **左边**
完美对比
</div>

<div class="fragment">
📊 **右边**
并列展示
</div>

</div>

</section>

<section>

## 三栏布局

```html
<div class="three-columns">
  <div>第一栏</div>
  <div>第二栏</div>
  <div>第三栏</div>
</div>
```

<div class="three-columns">

<div class="fragment card">
**功能 1**
简洁
</div>

<div class="fragment card">
**功能 2**
强大
</div>

<div class="fragment card">
**功能 3**
灵活
</div>

</div>

</section>

<section>

## 网格布局

```html
<div class="grid grid-2">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
  <div class="card">卡片4</div>
</div>
```

<div class="grid grid-2">
<div class="fragment card">📝 写作</div>
<div class="fragment card">🎨 设计</div>
<div class="fragment card">💻 编码</div>
<div class="fragment card">📊 展示</div>
</div>

</section>

</section>

---

<!-- Styled Boxes -->
<section>

<section class="center">

# 🎨 样式化框

</section>

<section>

## 信息框类型

<div class="highlight-box">
💡 **高亮信息框**
用于重要提示和关键信息
</div>

<div class="fragment warning-box">
⚠️ **警告信息框**
用于注意事项和警告
</div>

<div class="fragment success-box">
✅ **成功信息框**
用于成功消息和正面反馈
</div>

<div class="fragment error-box">
❌ **错误信息框**
用于错误提示和问题说明
</div>

</section>

<section>

## 使用方法

```html
<div class="highlight-box">
💡 重要信息
</div>

<div class="warning-box">
⚠️ 注意事项
</div>

<div class="success-box">
✅ 成功提示
</div>

<div class="error-box">
❌ 错误警告
</div>
```

</section>

</section>

---

<!-- Code Blocks -->
<section>

<section class="center">

# 💻 代码展示

</section>

<section>

## JavaScript 代码

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

<div class="fragment">
✨ 自动语法高亮！
</div>

</section>

<section>

## Python 代码

```python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(calculate_fibonacci(10))
```

<div class="fragment">
支持多种编程语言！
</div>

</section>

<section>

## 代码高亮行

```javascript {2,4-6}
function processData(data) {
  // 这行会高亮
  const result = [];
  for (let item of data) {
    result.push(item * 2);
  }
  return result;
}
```

<div class="fragment">
使用 `{行号}` 语法高亮特定行
</div>

</section>

</section>

---

<!-- Speaker Notes -->
<section>

<section class="center">

# 🎤 演讲者备注

</section>

<section>

## 什么是演讲者备注？

<div class="two-columns">

<div>

**观众看到的**
- 幻灯片内容
- 视觉元素
- 主要信息

</div>

<div>

**演讲者看到的**
- 幻灯片内容
- 私人备注
- 下一张预览
- 计时器

</div>

</div>

<aside class="notes">
这是演讲者备注示例！
观众看不到这段文字。
按 S 键打开演讲者视图。
</aside>

</section>

<section>

## 添加备注

```html
<section>

## 公开内容

观众看到的内容

<aside class="notes">
这是私人备注
只有演讲者能看到
可以添加提示和要点
</aside>

</section>
```

<div class="fragment">
**快捷键**: 按 <kbd>S</kbd> 打开演讲者视图
</div>

</section>

</section>

---

<!-- Keyboard Shortcuts -->
<section>

<section class="center">

# ⌨️ 键盘快捷键

</section>

<section>

## 导航快捷键

<div class="grid grid-2">

<div class="card">
<kbd>→</kbd> <kbd>↓</kbd>
下一张
</div>

<div class="card">
<kbd>←</kbd> <kbd>↑</kbd>
上一张
</div>

<div class="card">
<kbd>Home</kbd>
第一张
</div>

<div class="card">
<kbd>End</kbd>
最后一张
</div>

</div>

</section>

<section>

## 功能快捷键

<div class="grid grid-2">

<div class="card">
<kbd>F</kbd>
全屏模式
</div>

<div class="card">
<kbd>S</kbd>
演讲者视图
</div>

<div class="card">
<kbd>Esc</kbd>
缩略图概览
</div>

<div class="card">
<kbd>B</kbd> / <kbd>.</kbd>
暂停/黑屏
</div>

<div class="card">
<kbd>?</kbd>
显示帮助
</div>

<div class="card">
<kbd>Alt+Click</kbd>
放大
</div>

</div>

</section>

</section>

---

<!-- Workflow -->
<section>

<section class="center">

# 💼 完整工作流

从创建到发布

</section>

<section>

## 步骤 1: 在 Obsidian 创建

<ol class="large">
<li class="fragment">📂 打开 <code>slides/</code> 文件夹</li>
<li class="fragment">📝 创建新的 <code>.md</code> 文件</li>
<li class="fragment">⚙️ 添加 frontmatter 配置</li>
<li class="fragment">✍️ 使用 Templater 快速填充</li>
</ol>

</section>

<section>

## 步骤 2: 编写内容

```markdown
---
title: "我的演示"
theme: "night"
---

<section>

# 标题

内容

</section>

---

<section>

## 第二页

更多内容

</section>
```

</section>

<section>

## 步骤 3: 预览和调整

1. 在 Obsidian 中预览（Advanced Slides 插件）
2. 检查布局和动画
3. 调整内容和样式
4. 添加演讲者备注

</section>

<section>

## 步骤 4: 发布到 Web

<div class="two-columns">

<div>

**自动同步**
- 保存文件
- Git 自动提交
- 网站自动部署

</div>

<div>

**Web 访问**
- `/slides` 查看列表
- 点击查看演示
- 分享链接

</div>

</div>

</section>

</section>

---

<!-- Best Practices -->
<section>

<section class="center">

# ✨ 最佳实践

</section>

<section>

## 内容设计

<div class="grid grid-2">

<div class="success-box">

**✅ 推荐**
- 每页一个要点
- 使用 fragment 渐进
- 视觉元素辅助
- 保持简洁

</div>

<div class="warning-box">

**⚠️ 避免**
- 内容过多
- 字体过小
- 颜色冲突
- 缺乏层次

</div>

</div>

</section>

<section>

## 演示技巧

<div class="highlight-box">

**💡 专业建议**

1. **开场强有力** - 吸引注意力
2. **结构清晰** - 逻辑流畅
3. **视觉一致** - 统一风格
4. **互动引导** - 提问思考
5. **结尾有力** - 留下印象

</div>

</section>

<section>

## 技术准备

<ol>
<li class="fragment">📱 测试不同设备</li>
<li class="fragment">🌐 检查浏览器兼容性</li>
<li class="fragment">🎤 准备演讲者备注</li>
<li class="fragment">💾 本地备份演示文件</li>
<li class="fragment">🔗 准备分享链接</li>
</ol>

</section>

</section>

---

<!-- Examples -->
<section>

<section class="center">

# 📚 示例库

</section>

<section>

## 现有演示

<div class="three-columns">

<div class="card">

**Obsidian 集成**
完整功能展示

[查看](/slides/obsidian-integration)

</div>

<div class="card">

**Dataview 演示**
查询功能详解

[查看](/slides/dataview-demo)

</div>

<div class="card">

**本演示**
Advanced Slides 教程

[当前页面]

</div>

</div>

</section>

<section>

## 模板资源

在你的笔记库中：

- 📝 `template/slides/templater-template.md` - 幻灯片模板
- 📚 `docs/obsidian-integration-examples.md` - 完整文档
- 🎯 示例演示文稿 - 参考学习

</section>

</section>

---

<!-- Troubleshooting -->
<section>

<section class="center">

# 🔧 故障排除

</section>

<section>

## 常见问题

<div class="two-columns">

<div>

**问题**: 幻灯片不显示

**解决**:
- 检查 section 标签
- 验证 frontmatter
- 确认主题名称

</div>

<div>

**问题**: 样式不正确

**解决**:
- 检查 CSS 类名
- 验证 HTML 标签
- 查看浏览器控制台

</div>

</div>

</section>

<section>

## 调试技巧

<div class="highlight-box">

**🔍 调试步骤**

1. **简化内容** - 从最简单的幻灯片开始
2. **逐步添加** - 一次添加一个功能
3. **检查语法** - 确保 HTML/Markdown 正确
4. **查看示例** - 参考现有演示
5. **浏览器工具** - F12 查看错误

</div>

</section>

</section>

---

<!-- Resources -->
<section>

<section class="center">

# 📖 学习资源

</section>

<section>

## 官方文档

<div class="two-columns">

<div>

**Reveal.js**
- [官方网站](https://revealjs.com/)
- [演示示例](https://revealjs.com/demo/)
- [完整文档](https://revealjs.com/documentation/)

</div>

<div>

**Advanced Slides**
- [GitHub 仓库](https://github.com/MSzturc/obsidian-advanced-slides)
- [使用指南](https://github.com/MSzturc/obsidian-advanced-slides/blob/develop/README.md)
- [示例集合](https://github.com/MSzturc/obsidian-advanced-slides/tree/develop/examples)

</div>

</div>

</section>

<section>

## 社区资源

<div class="grid grid-3">

<div class="card">
**Obsidian 论坛**
讨论和求助
</div>

<div class="card">
**Discord 社区**
实时交流
</div>

<div class="card">
**GitHub Issues**
问题反馈
</div>

<div class="card">
**YouTube 教程**
视频学习
</div>

<div class="card">
**示例模板**
参考借鉴
</div>

<div class="card">
**博客文章**
经验分享
</div>

</div>

</section>

</section>

---

<!-- Next Steps -->
<section>

<section class="center">

# 🚀 下一步行动

</section>

<section>

## 立即开始

<ol class="large">
<li class="fragment">📥 安装 Advanced Slides 插件</li>
<li class="fragment">📝 使用模板创建第一个演示</li>
<li class="fragment">🎨 尝试不同主题和布局</li>
<li class="fragment">🌐 发布到 Web 并分享</li>
</ol>

<div class="fragment">

**提示**: 从简单开始，逐步掌握高级功能！

</div>

</section>

<section>

## 进阶挑战

<div class="three-columns">

<div class="card">

**设计大师**

创建统一视觉风格的演示套件

</div>

<div class="card">

**动画专家**

掌握所有 fragment 和过渡效果

</div>

<div class="card">

**工作流优化**

整合 Templater + Dataview + Slides

</div>

</div>

</section>

</section>

---

<!-- Thank You -->
<section class="center">

# 🎉 感谢观看！

## 用 Markdown 创造精彩演示

<div class="fragment">

✅ 简单易用的 Markdown 语法
✅ 强大灵活的 Reveal.js 功能
✅ Obsidian 完美集成
✅ 一键发布到 Web

</div>

<div class="fragment">

---

<div class="small">
📚 完整文档: `/docs/obsidian-integration-examples`

🎓 更多演示: `/slides`

💡 开始创建你的第一个演示吧！
</div>

</div>

</section>

<!-- Speaker Notes -->
<aside class="notes">
这是 Advanced Slides 完整教程演示文稿。
涵盖基础结构、主题、布局、动画、最佳实践等所有内容。
使用键盘方向键导航，按 S 键查看演讲者备注。
现在你可以开始创建自己的精彩演示了！
</aside>
