# 🚀 Netlify 部署修复说明

## ✅ 已修复的问题

### 1. Swup 变量重复声明错误
**问题：** `Identifier 'selectedPeriod' has already been declared`

**原因：** Swup 在页面切换时重新执行脚本，导致全局变量重复声明

**修复：**
```javascript
// 使用 window 对象存储全局状态，避免重复声明
if (!window.summaryPageState) {
  window.summaryPageState = {
    selectedPeriod: 'week',
    currentSummaryData: null,
    // ... 其他状态
  };
}
```

### 2. API 端点 404 错误
**问题：** `/api/deepseek-chat` 和 `/api/zimage-generate` 返回 404

**原因：** Netlify 上使用 `output: 'static'` 模式时，API 路由无法正常工作

**修复：** 改用 `output: 'hybrid'` 模式

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid', // ✅ 混合模式：静态页面 + 动态 API
  adapter: netlify({
    edgeMiddleware: false,
  }),
});
```

### 3. 页面预渲染配置
为了保持性能，所有静态页面都添加了 `export const prerender = true;`：

```typescript
// src/pages/summary.astro
---
export const prerender = true;  // ✅ 静态预渲染

import BaseLayout from '@/layouts/BaseLayout.astro';
// ...
---
```

API 路由保持动态：
```typescript
// src/pages/api/deepseek-chat.ts
export const prerender = false;  // ✅ 服务端渲染
```

## 📋 修改的文件清单

### 配置文件
- ✅ `astro.config.mjs` - 改为 hybrid 模式

### 页面文件（添加 prerender: true）
- ✅ `src/pages/index.astro`
- ✅ `src/pages/posts/index.astro`
- ✅ `src/pages/projects/index.astro`
- ✅ `src/pages/docs/index.astro`
- ✅ `src/pages/diary/index.astro`
- ✅ `src/pages/slides/index.astro`
- ✅ `src/pages/todo/index.astro`
- ✅ `src/pages/statistic/index.astro`
- ✅ `src/pages/summary.astro`

### 脚本修复
- ✅ `src/pages/summary.astro` - 修复 Swup 变量重复声明

### API 端点（保持 prerender: false）
- ✅ `src/pages/api/deepseek-chat.ts`
- ✅ `src/pages/api/zimage-generate.ts`

## 🚀 部署步骤

### 1. 提交并推送修复
```bash
git add .
git commit -m "Fix: Netlify deployment issues - hybrid mode + Swup fixes"
git push origin master
```

### 2. Netlify 自动部署
Netlify 将自动检测到推送并开始构建：
1. 构建静态页面
2. 生成 Netlify Functions（API 路由）
3. 部署到生产环境

### 3. 验证部署
部署完成后，访问你的 Netlify 站点，检查：

#### 检查页面
- ✅ 首页加载正常
- ✅ /summary/ 页面显示正常

#### 检查 API
1. 打开 /summary/ 页面
2. 配置并生成总结
3. 在浏览器控制台查看：
   - 应该看到 200 响应（不是 404）
   - API 调用成功完成

## 📊 Hybrid 模式说明

### 什么是 Hybrid 模式？
Hybrid 模式结合了静态生成和服务端渲染的优势：

**静态页面（prerender: true）**
- 构建时生成 HTML
- 快速加载
- CDN 缓存
- SEO 友好

**动态 API（prerender: false）**
- 运行时处理请求
- 支持 POST 请求
- 访问服务端资源
- 作为 Netlify Functions 部署

### 为什么不用 output: 'static'？
在 Astro 5 + Netlify 的组合中：
- ❌ `output: 'static'` - API 路由不会生成 Netlify Functions
- ✅ `output: 'hybrid'` - API 路由自动转换为 Netlify Functions
- ✅ `output: 'server'` - 全站 SSR（不推荐，性能较差）

## 🔍 故障排除

### 如果 API 仍然 404

1. **检查 Netlify Functions 日志**
   - 登录 Netlify Dashboard
   - 进入 Functions 标签
   - 查看是否有 `deepseek-chat` 和 `zimage-generate` 函数

2. **检查构建日志**
   ```
   Search for: "functions"
   应该看到：
   ✓ API routes built as Netlify Functions
   ```

3. **检查函数调用**
   - Netlify Dashboard → Functions → 选择函数
   - 查看调用日志和错误信息

### 如果页面加载慢

可能原因：页面被误标记为 SSR

**解决：** 确认页面有 `export const prerender = true;`

```bash
# 检查所有页面
grep -r "export const prerender" src/pages/ --include="*.astro"
```

### 如果 Swup 错误仍然存在

1. 清除浏览器缓存
2. 检查是否使用了最新部署
3. 查看 `window.summaryPageState` 是否正确初始化

## 📈 性能优化建议

### 1. 启用构建缓存
```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "8"

[[plugins]]
  package = "@netlify/plugin-nextjs"  # 如果使用
```

### 2. 配置函数超时
```toml
[functions]
  # API 函数超时时间
  timeout = 60
```

### 3. 添加缓存头
静态资源自动缓存，API 响应可以添加缓存控制：

```typescript
// src/pages/api/deepseek-chat.ts
return new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache' // API 不缓存
  }
});
```

## 🎯 预期结果

部署成功后：

### 页面性能
- ✅ 首屏加载快（静态HTML）
- ✅ 页面切换流畅（Swup）
- ✅ SEO 优化完整

### API 功能
- ✅ DeepSeek API 调用成功
- ✅ z-image-turbo 图片生成正常
- ✅ 响应时间在可接受范围内

### 用户体验
- ✅ 无 JavaScript 错误
- ✅ API 调用稳定
- ✅ 错误提示友好

## 📞 支持

如果遇到其他问题：

1. **查看浏览器控制台**
   - 检查详细的错误信息
   - 查看网络请求状态

2. **查看 Netlify 日志**
   - Build logs（构建日志）
   - Function logs（函数日志）
   - Deploy logs（部署日志）

3. **检查环境变量**
   - API Keys 是否正确配置
   - 环境变量是否设置

---

**更新时间：** 2025-12-09
**状态：** ✅ 修复完成，可以部署
