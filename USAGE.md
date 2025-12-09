# Qlog 使用说明

这是一个基于 Astro 的个人博客系统，集成了日记（Diary）、待办事项（Todo）、数据统计（Statistics）和生活总结（Summary）功能。

## 📁 项目结构

```
qlog/
├── src/
│   ├── content/
│   │   ├── diary/          # 日记条目
│   │   ├── todo/           # 待办事项
│   │   ├── posts/          # 博客文章
│   │   ├── projects/       # 项目展示
│   │   └── docs/           # 文档
│   ├── pages/
│   │   ├── diary/          # 日记页面
│   │   ├── todo/           # 待办页面
│   │   ├── statistic/      # 统计页面
│   │   ├── summary.astro   # 生活总结页面
│   │   └── api/            # API 端点
│   ├── components/         # 组件
│   └── layouts/            # 布局
└── public/                 # 静态资源
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或者
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或者
pnpm dev
```

访问 `http://localhost:4321` 查看网站。

### 3. 构建生产版本

```bash
npm run build
# 或者
pnpm build
```

## 📝 功能说明

### 1. 日记功能（Diary）

在 `src/content/diary/` 目录下创建 Markdown 文件来写日记。

#### 日记模板

```markdown
---
title: "我的一天"
description: "今天是美好的一天"
date: 2025-12-09
mood: happy # happy, sad, neutral, excited, tired, stressed, peaceful
weather: "晴天"
location: "北京"
tags: ["生活", "工作"]
image: "/images/diary/2025-12-09.jpg" # 可选
---

今天发生了很多有趣的事情...
```

访问 `/diary/` 查看所有日记。

### 2. 待办事项功能（Todo）

在 `src/content/todo/` 目录下创建 Markdown 文件来管理任务。

#### Todo 模板

```markdown
---
title: "完成项目报告"
description: "需要在本周五前完成"
date: 2025-12-09
dueDate: 2025-12-13
priority: high # high, medium, low
status: in-progress # todo, in-progress, done
category: "工作"
tags: ["重要", "紧急"]
estimatedTime: "4小时"
progress: 50 # 0-100
---

项目报告需要包含以下内容：
1. 项目背景
2. 实施方案
3. 预期成果
```

访问 `/todo/` 查看所有待办事项。

### 3. 数据统计功能（Statistics）

访问 `/statistic/` 查看你的：
- 日记数量和心情分布
- 待办事项完成情况
- 标签使用统计
- 逾期任务提醒
- 即将到期的任务

数据自动从日记和待办事项中计算生成。

### 4. 生活总结功能（Summary）

这是本项目的核心功能！类似网易云音乐和QQ音乐的年度总结。

访问 `/summary/` 使用此功能。

#### 功能特点

- ✅ **多种时间段选择**
  - 周总结（过去7天）
  - 月总结（过去30天）
  - 自定义10n天（如10天、20天、30天等）
  - 年度总结（过去365天）

- 🤖 **AI 智能分析**
  - 使用 DeepSeek API 生成个性化总结
  - 包含：整体主题、亮点回顾、成长洞察、未来建议、励志语录
  - 风格类似音乐平台的年度回顾

- 🎨 **可视化卡片生成**
  - 使用 z-image-turbo 生成精美总结卡片
  - 自动配色，匹配你的心情主题
  - 支持下载和分享

## 🔑 API 配置

### DeepSeek API

1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册并获取 API Key
3. 在总结页面输入 API Key 使用

### z-image-turbo API

1. 访问 [Gitee AI](https://ai.gitee.com)
2. 注册并获取 API Key
3. 在总结页面勾选"生成可视化卡片"并输入 API Key

**注意：** API Keys 仅在浏览器中使用，不会被存储到服务器。

## 📊 API 端点

### 获取统计数据

```bash
GET /api/statistics.json
```

返回所有日记和待办事项的统计信息。

### 获取音乐风格总结数据

```bash
GET /api/music-summary.json?period=week&n=1
```

参数：
- `period`: `week` | `month` | `10n` | `year`
- `n`: 当 period 为 `10n` 时，表示 10n 天

### 生成 AI 总结（带图片）

```bash
POST /api/music-summary.json
Content-Type: application/json

{
  "deepseekApiKey": "your-deepseek-api-key",
  "zImageApiKey": "your-zimage-api-key", // 可选
  "period": "week",
  "n": 1,
  "includeImage": true
}
```

## 🎯 使用示例

### 示例 1: 创建日记

在 `src/content/diary/2025-12-09-beautiful-day.md`:

```markdown
---
title: "美好的一天"
description: "阳光明媚的周末"
date: 2025-12-09
mood: happy
weather: "晴天☀️"
location: "公园"
tags: ["周末", "户外"]
---

今天和家人去公园散步，天气特别好。
看到了很多人在放风筝，心情格外愉悦。
```

### 示例 2: 创建待办事项

在 `src/content/todo/2025-12-project-report.md`:

```markdown
---
title: "完成Q4项目报告"
description: "整理本季度项目成果"
date: 2025-12-09
dueDate: 2025-12-15
priority: high
status: in-progress
category: "工作"
tags: ["报告", "重要"]
estimatedTime: "6小时"
progress: 30
---

## 任务清单

- [x] 收集数据
- [x] 制作图表
- [ ] 撰写总结
- [ ] 审核校对
- [ ] 提交报告
```

### 示例 3: 生成周总结

1. 访问 `/summary/`
2. 选择"周总结"
3. 输入 DeepSeek API Key
4. （可选）勾选生成图片并输入 z-image-turbo API Key
5. 点击"生成我的总结"
6. 查看 AI 生成的个性化总结和卡片

## 🎨 自定义主题

在 `src/config.ts` 中修改主题：

```typescript
export const siteConfig: SiteConfig = {
  theme: "oxygen", // 可选: minimal, oxygen, atom, ayu 等
  // ... 其他配置
};
```

## 📱 响应式设计

所有页面都已优化移动端显示：
- 日记卡片自适应布局
- 待办事项筛选器响应式
- 统计图表自动缩放
- 总结页面移动友好

## 🔧 开发说明

### 添加新的内容类型

1. 在 `src/content.config.ts` 中定义 schema
2. 在 `src/content/` 创建对应目录
3. 在 `src/pages/` 创建展示页面
4. 在 `src/components/` 创建卡片组件

### 修改 API 逻辑

API 代码位于 `src/pages/api/`：
- `statistics.json.ts` - 统计数据
- `music-summary.json.ts` - 总结生成

## 📋 代码示例

### 调用 DeepSeek API

```javascript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'You are a creative summary generator.',
      },
      {
        role: 'user',
        content: 'Generate a summary for...',
      },
    ],
  }),
});
```

### 调用 z-image-turbo API

```javascript
const response = await fetch('https://ai.gitee.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'z-image-turbo',
    prompt: 'A beautiful summary card...',
    negative_prompt: '低质量, 丑陋, 畸形, 模糊',
    size: '1024x1024',
    extra_body: {
      num_inference_steps: 12,
    },
  }),
});
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Astro](https://astro.build) - 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [DeepSeek](https://deepseek.com) - AI 文本生成
- [z-image-turbo](https://ai.gitee.com) - AI 图片生成

---

Made with ❤️ by 贺昌嘉
