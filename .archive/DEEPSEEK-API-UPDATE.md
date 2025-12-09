# DeepSeek API 集成更新

## 更新日期：2025-12-09

## 问题说明

之前的实现直接在浏览器中调用 DeepSeek API，导致 "Failed to fetch" 错误。这是因为：

1. **CORS 限制**：浏览器跨域请求可能被阻止
2. **网络环境限制**：某些网络环境可能无法直接访问 DeepSeek API
3. **官方推荐方式**：DeepSeek 官方示例使用 OpenAI SDK（服务端调用）

## 解决方案

### 架构改进

现在使用 **服务端代理模式**：

```
浏览器 → 本地服务端 API (/api/deepseek-chat) → DeepSeek API
```

### 实现细节

#### 1. 配置变更

**文件：`astro.config.mjs`**

**重要：Astro 5 配置说明**

在 Astro 5 中，`output: 'hybrid'` 已被弃用。正确的配置是保持 `static` 模式，然后在特定端点使用 `prerender: false`：

```javascript
export default defineConfig({
  site: siteConfig.site,
  output: 'static', // 保持静态模式
  // ...
});
```

服务端 API 端点单独标记为不预渲染：

```typescript
// src/pages/api/deepseek-chat.ts
export const prerender = false; // 此端点需要服务端渲染
```

这样大部分页面保持静态（快速、SEO 友好），只有 API 端点使用服务端渲染。

#### 2. 安装依赖

```bash
npm install openai
```

OpenAI SDK 完全兼容 DeepSeek API，只需修改 baseURL。

#### 3. 创建服务端 API 代理

**文件：`src/pages/api/deepseek-chat.ts`**

这是一个服务端 API 端点（`prerender = false`），使用 OpenAI SDK 调用 DeepSeek：

```typescript
import OpenAI from 'openai';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { apiKey, messages, max_tokens, temperature } = await request.json();

  // 初始化 OpenAI 客户端，配置 DeepSeek baseURL
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey,
  });

  // 调用 DeepSeek API
  const completion = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: messages,
    max_tokens: max_tokens || 1500,
    temperature: temperature || 0.8,
  });

  return new Response(JSON.stringify({ success: true, data: completion }));
};
```

**特点：**
- ✅ 使用官方推荐的 OpenAI SDK
- ✅ 服务端调用，避免 CORS 问题
- ✅ 完整的错误处理
- ✅ API Key 验证（必须以 `sk-` 开头）
- ✅ 详细的错误消息（401, 429, 500 等）

#### 4. 修改前端调用

**文件：`src/pages/summary.astro`**

前端现在调用本地服务端 API，而不是直接调用 DeepSeek：

**之前（直接调用）：**
```javascript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ model: 'deepseek-chat', messages })
});
```

**现在（通过服务端代理）：**
```javascript
const response = await fetch('/api/deepseek-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    apiKey: apiKey,
    messages: messages,
    max_tokens: 1500,
    temperature: 0.8
  })
});

const result = await response.json();
if (result.success) {
  const analysis = result.data.choices[0].message.content;
  // 使用分析结果...
}
```

## 优势

### 1. **稳定性**
- ✅ 服务端调用更稳定
- ✅ 避免浏览器环境限制
- ✅ 统一的错误处理

### 2. **兼容性**
- ✅ 遵循 DeepSeek 官方推荐
- ✅ 使用成熟的 OpenAI SDK
- ✅ 支持所有浏览器

### 3. **安全性**
- ✅ API Key 在服务端验证
- ✅ 统一的认证流程
- ✅ 更好的错误信息保护

### 4. **可维护性**
- ✅ 集中的 API 调用逻辑
- ✅ 易于添加日志和监控
- ✅ 便于未来扩展

## 使用方式

### 对用户来说，使用方式完全不变：

1. 访问 `/summary/` 页面
2. 选择时间段（周/月/10n天/年度）
3. 输入 DeepSeek API Key（从 https://platform.deepseek.com/api_keys 获取）
4. （可选）勾选生成图片并输入 z-image-turbo API Key
5. 点击"生成我的总结"

### 区别：

**之前：** 浏览器直接调用 DeepSeek API → 可能失败
**现在：** 浏览器 → 本地服务端 → DeepSeek API → 成功！

## 部署说明

### 开发环境

```bash
npm run dev
```

服务端 API 会自动运行在开发服务器上。

### 生产部署

#### Netlify/Vercel/Cloudflare Pages

这些平台自动支持 Astro 的 hybrid 模式和服务端 API：

```bash
npm run build
```

构建后的 API 端点会自动部署为 serverless functions。

#### 静态主机（Nginx/Apache）

如果需要纯静态部署，需要：
1. 部署一个独立的 Node.js 服务来运行 API
2. 或者修改回客户端直接调用（可能遇到原问题）

**推荐使用支持 serverless 的平台（Netlify/Vercel）。**

## 错误处理

服务端 API 提供清晰的错误信息：

### 401 - API Key 无效
```json
{
  "success": false,
  "error": "API Key无效或已过期，请检查您的DeepSeek API Key"
}
```

### 429 - 请求频率超限
```json
{
  "success": false,
  "error": "API调用频率超限，请稍后再试"
}
```

### 500 - 服务器错误
```json
{
  "success": false,
  "error": "DeepSeek服务器错误，请稍后再试"
}
```

## 调试

### 服务端日志

查看服务端控制台输出：
```
Calling DeepSeek API via OpenAI SDK...
DeepSeek API call successful
```

### 浏览器日志

查看浏览器控制台（F12）：
```
Fetching summary data...
Summary data fetched: {...}
Calling DeepSeek API...
Server API response status: 200
Server API response: { success: true, data: {...} }
Displaying results...
```

## 测试 API Key

使用 curl 测试 API Key（通过我们的服务端）：

```bash
curl -X POST http://localhost:5000/api/deepseek-chat \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-YOUR_API_KEY",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "max_tokens": 100
  }'
```

成功响应：
```json
{
  "success": true,
  "data": {
    "choices": [
      {
        "message": {
          "content": "Hello! How can I help you today?"
        }
      }
    ]
  }
}
```

## 常见问题

### Q: 为什么要使用服务端代理？
**A:** 避免 CORS 问题，遵循官方推荐，提供更稳定的调用方式。

### Q: API Key 会被存储吗？
**A:** 不会！API Key 每次从前端传递到服务端，仅用于当次请求，不会被存储。

### Q: 性能会受影响吗？
**A:** 不会。服务端代理几乎不增加延迟，而且避免了浏览器的各种限制。

### Q: 如何部署到生产环境？
**A:** 推荐使用 Netlify、Vercel 或 Cloudflare Pages，它们原生支持 Astro hybrid 模式。

### Q: 可以切换回客户端调用吗？
**A:** 技术上可以，但不推荐。如果网络环境允许，可以修改代码恢复直接调用。

## 相关文件

- `astro.config.mjs` - 配置 hybrid 模式
- `src/pages/api/deepseek-chat.ts` - 服务端 API 代理
- `src/pages/summary.astro` - 前端调用逻辑
- `package.json` - OpenAI SDK 依赖

## 更新日志

- **2025-12-09**: 创建服务端 API 代理
- **2025-12-09**: 安装 OpenAI SDK
- **2025-12-09**: 修改配置为 hybrid 模式
- **2025-12-09**: 更新前端调用逻辑
- **2025-12-09**: 添加完整错误处理

---

## 总结

✅ **问题解决**: "Failed to fetch" 错误已修复
✅ **架构改进**: 使用官方推荐的服务端调用方式
✅ **用户体验**: 使用方式完全不变，但更稳定
✅ **生产就绪**: 可直接部署到支持 serverless 的平台

现在可以正常使用 DeepSeek API 生成生活总结了！🎉
