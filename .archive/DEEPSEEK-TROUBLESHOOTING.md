# DeepSeek API 故障排除指南

## 问题：生成失败 - "Failed to fetch"

### 已修复的问题

1. ✅ **添加详细的错误处理**
   - 更清晰的错误消息
   - 详细的控制台日志
   - API Key格式验证

2. ✅ **改进的网络请求处理**
   - Try-catch包装fetch调用
   - 区分网络错误和API错误
   - 详细的状态码处理

3. ✅ **更好的用户反馈**
   - 针对不同错误的具体提示
   - API Key格式提示
   - 获取API Key的直接链接

### 如何使用

#### 1. 获取DeepSeek API Key

访问：https://platform.deepseek.com/api_keys

1. 注册/登录账号
2. 创建新的API Key
3. 复制API Key（格式：`sk-xxxxxxxxxxxxx`）

#### 2. 使用API Key

1. 在summary页面输入API Key
2. 确保API Key以 `sk-` 开头
3. 点击"生成我的总结"

### 常见错误及解决方法

#### 错误1: "Failed to fetch"
**原因**: 网络连接问题或CORS问题

**解决方法**:
1. 检查网络连接
2. 确认可以访问 https://api.deepseek.com
3. 查看浏览器控制台（F12）的详细错误信息
4. 尝试刷新页面重试

#### 错误2: "API Key无效或已过期"
**原因**: API Key格式错误或已失效

**解决方法**:
1. 确认API Key以 `sk-` 开头
2. 重新复制API Key，避免多余的空格
3. 在DeepSeek平台检查API Key状态
4. 必要时重新生成API Key

#### 错误3: "API调用频率超限"
**原因**: 短时间内请求过多

**解决方法**:
1. 等待几分钟后重试
2. 检查DeepSeek账户的配额限制
3. 升级API套餐（如需要）

#### 错误4: "DeepSeek服务器错误"
**原因**: DeepSeek服务暂时不可用

**解决方法**:
1. 等待几分钟后重试
2. 检查DeepSeek服务状态
3. 如果持续出现，联系DeepSeek支持

### 调试步骤

#### 1. 打开浏览器开发者工具
- Chrome/Edge: 按 F12 或 Ctrl+Shift+I
- Firefox: 按 F12 或 Ctrl+Shift+K
- Safari: Cmd+Option+I

#### 2. 查看Console标签
查找以下日志：
```
Fetching summary data...
Summary data fetched: {...}
Calling DeepSeek API...
DeepSeek API request payload: {...}
DeepSeek API response status: 200
DeepSeek API response data: {...}
```

#### 3. 查看Network标签
1. 刷新页面
2. 点击"生成我的总结"
3. 查找对 `api.deepseek.com` 的请求
4. 检查：
   - Request Headers（特别是Authorization）
   - Request Payload
   - Response Status
   - Response Body

### API请求格式

正确的DeepSeek API请求：

```javascript
fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-xxxxxxxxxxxxx',
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: '...',
      },
      {
        role: 'user',
        content: '...',
      },
    ],
    max_tokens: 1500,
    temperature: 0.8,
  }),
});
```

### 验证API Key

使用curl测试API Key是否有效：

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

如果返回有效的JSON响应，说明API Key正常。

### DeepSeek API 文档

官方文档：https://platform.deepseek.com/api-docs/

重要端点：
- Chat Completions: `https://api.deepseek.com/v1/chat/completions`
- Models: `https://api.deepseek.com/v1/models`

### 浏览器兼容性

确保使用现代浏览器：
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### CORS说明

DeepSeek API支持跨域请求（CORS），因此可以直接从浏览器调用。

如果遇到CORS错误：
1. 检查是否在HTTPS环境（localhost除外）
2. 确认请求头格式正确
3. 尝试清除浏览器缓存

### 安全提示

⚠️ **重要**:
- 不要在公共场所或不信任的网络中输入API Key
- 定期更换API Key
- 不要将API Key提交到版本控制系统
- 使用环境变量存储API Key（生产环境）

### 成功指标

如果一切正常，你应该看到：
1. ✅ 加载动画出现
2. ✅ 控制台显示"Calling DeepSeek API..."
3. ✅ 控制台显示"DeepSeek API response status: 200"
4. ✅ 控制台显示"Displaying results..."
5. ✅ 页面显示生成的总结

### 性能优化

- 首次调用可能需要5-10秒
- 后续调用通常在2-5秒内完成
- 图片生成可能需要额外15-30秒

### 获取帮助

如果问题仍然存在：
1. 检查USAGE.md文档
2. 查看浏览器控制台的完整错误信息
3. 确认网络可以访问api.deepseek.com
4. 尝试使用不同的浏览器
5. 检查防火墙设置

### 更新日志

- 2025-12-09: 添加详细的错误处理和调试日志
- 2025-12-09: 添加API Key格式验证
- 2025-12-09: 改进网络错误提示
- 2025-12-09: 添加控制台日志输出

---

所有修复已完成，现在可以：
1. 刷新浏览器
2. 访问 `/summary/`
3. 输入有效的DeepSeek API Key（以sk-开头）
4. 生成你的个性化总结！

如有问题，请查看浏览器控制台（F12）的详细日志。
