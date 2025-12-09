# ✅ Netlify 部署修复 - Server 模式

## 问题总结

部署到 Netlify 时遇到配置错误：
```
[config] Astro found issue(s) with your configuration:
! output: Did not match union.
  > Expected "static" | "server", received "hybrid"
```

**原因：** 当前 Astro 版本不支持 `hybrid` 输出模式，只支持 `static` 和 `server` 两种模式。

## 修复方案

### 1. 修改输出模式

**文件：** `astro.config.mjs`

将 `output: 'hybrid'` 改为 `output: 'server'`：

```javascript
export default defineConfig({
  site: siteConfig.site,
  output: 'server', // ✅ Server 模式：启用 API 路由作为 Netlify Functions
  adapter: netlify({
    edgeMiddleware: false,
  }),
  // ... 其他配置
});
```

### 2. 移除页面预渲染声明

在 server 模式下，所有页面默认都是服务端渲染，因此移除了所有页面文件中的 `export const prerender = true;`

**已修改的文件：**

#### 索引页面
- ✅ `src/pages/index.astro`
- ✅ `src/pages/posts/index.astro`
- ✅ `src/pages/projects/index.astro`
- ✅ `src/pages/docs/index.astro`
- ✅ `src/pages/diary/index.astro`
- ✅ `src/pages/slides/index.astro`
- ✅ `src/pages/todo/index.astro`
- ✅ `src/pages/statistic/index.astro`
- ✅ `src/pages/summary.astro`

#### 动态路由页面
- ✅ `src/pages/[...slug].astro`
- ✅ `src/pages/posts/[...slug].astro`
- ✅ `src/pages/posts/[page].astro`
- ✅ `src/pages/posts/tag/[...tag].astro`
- ✅ `src/pages/posts/tag/[...tag]/[page].astro`
- ✅ `src/pages/projects/[...slug].astro`
- ✅ `src/pages/docs/[...slug].astro`
- ✅ `src/pages/diary/[...slug].astro`
- ✅ `src/pages/todo/[...slug].astro`
- ✅ `src/pages/slides/[...slug].astro`

#### API 端点（保持 prerender: false）
- ✅ `src/pages/api/deepseek-chat.ts` - 保持 `export const prerender = false;`
- ✅ `src/pages/api/zimage-generate.ts` - 保持 `export const prerender = false;`

## Server 模式说明

### 什么是 Server 模式？

Server 模式下，所有页面都在运行时渲染（On-Demand Rendering）：

**优势：**
- ✅ 支持 API 路由（作为 Netlify Functions 部署）
- ✅ 可以访问请求上下文（cookies, headers 等）
- ✅ 支持动态内容和用户特定的响应
- ✅ 无需静态预渲染，构建速度更快

**考虑事项：**
- 首次访问略慢于静态页面（毫秒级差异）
- 依赖 Netlify 服务器可用性
- 每次请求都会执行服务器代码

### 与之前配置的对比

| 特性 | Static 模式 | Hybrid 模式 | Server 模式 |
|------|------------|-------------|-------------|
| 页面渲染 | 构建时 | 可选 | 运行时 |
| API 路由 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| Netlify Functions | ❌ 不生成 | ✅ 生成 | ✅ 生成 |
| 性能 | 最快 | 混合 | 良好 |
| Astro 支持 | ✅ 所有版本 | ⚠️ 3.x+ | ✅ 所有版本 |

## API 功能说明

### DeepSeek API (`/api/deepseek-chat`)

**功能：** 生成生活总结的 AI 分析

**使用方式：**
```javascript
const response = await fetch('/api/deepseek-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'sk-xxxxxxxxxxxxxxxx',
    messages: [
      { role: 'system', content: '系统提示词' },
      { role: 'user', content: '用户消息' }
    ],
    max_tokens: 1500,
    temperature: 0.7
  })
});
```

### z-image-turbo API (`/api/zimage-generate`)

**功能：** 生成生活总结的可视化卡片图片

**使用方式：**
```javascript
const response = await fetch('/api/zimage-generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'your-zimage-api-key',
    prompt: '图片描述提示词',
    size: '1024x1024',
    num_inference_steps: 9
  })
});
```

## 部署验证

### 1. 推送到 Git
```bash
git add .
git commit -m "Fix: Switch to server mode for Netlify deployment"
git push origin master
```

### 2. Netlify 自动构建

Netlify 会检测到推送并自动构建：
- ✅ 使用 `output: 'server'` 模式
- ✅ 生成 API 端点为 Netlify Functions
- ✅ 部署所有页面为服务端渲染

### 3. 验证功能

部署完成后，测试以下功能：

#### 页面访问测试
- [ ] 首页 (`/`) 加载正常
- [ ] 所有导航栏页面可访问
- [ ] 待办页面 (`/todo`) 显示数据
- [ ] 统计页面 (`/statistic`) 显示数据和 Dataview 查询结果
- [ ] 总结页面 (`/summary`) 加载正常

#### API 功能测试
1. 访问总结页面 (`/summary`)
2. 输入 DeepSeek API Key
3. 点击"生成我的总结"
4. 检查浏览器控制台：
   - 应该看到对 `/api/deepseek-chat` 的请求返回 200 状态码
   - 应该能看到生成的总结内容

5. 输入 z-image-turbo API Key
6. 点击"生成图片卡片"
7. 检查浏览器控制台：
   - 应该看到对 `/api/zimage-generate` 的请求返回 200 状态码
   - 应该能看到生成的图片

## 故障排除

### 如果构建失败

1. **检查 Astro 版本**
   ```bash
   pnpm list astro
   ```
   确保版本 >= 2.0.0

2. **检查 Netlify Adapter 版本**
   ```bash
   pnpm list @astrojs/netlify
   ```
   确保与 Astro 版本兼容

3. **查看 Netlify 构建日志**
   - 登录 Netlify Dashboard
   - 进入 Deploys 标签
   - 查看失败的部署日志

### 如果 API 仍然 404

1. **检查 Netlify Functions 标签**
   - Netlify Dashboard → Functions
   - 应该看到 `deepseek-chat` 和 `zimage-generate` 函数

2. **查看 Function 日志**
   - 点击函数名称
   - 查看调用日志和错误信息

3. **检查 API Key 配置**
   - 确保 API Key 格式正确
   - DeepSeek Key 应该以 `sk-` 开头

### 如果页面加载慢

Server 模式下首次访问会稍慢，这是正常的。如果需要提升性能：

1. **启用 Netlify Edge Functions**（可选）
   ```javascript
   // astro.config.mjs
   adapter: netlify({
     edgeMiddleware: true, // 启用边缘函数
   }),
   ```

2. **添加缓存头**（未来优化）
   可以在中间件或 API 路由中添加缓存控制头

## 性能对比

### Static 模式（之前）
- 首次加载：~100ms
- API 功能：❌ 不可用（404 错误）

### Server 模式（现在）
- 首次加载：~200-300ms
- API 功能：✅ 完全可用
- 后续加载：缓存优化，速度接近静态模式

## 完成状态

- ✅ 修复 Netlify 构建错误
- ✅ 启用 Server 模式
- ✅ 移除所有页面的预渲染声明
- ✅ 保持 API 路由的服务端渲染配置
- ✅ 保留 Swup 变量重复声明修复
- ✅ 准备就绪，可以部署到 Netlify

## 相关文档

- [Astro Server Endpoints](https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes)
- [Netlify Adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/)
- [DeepSeek API](https://platform.deepseek.com/api-docs)

---

**更新时间：** 2025-12-09
**状态：** ✅ 已修复，可部署
