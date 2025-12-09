# 🎨 总结页面优化方案

## 改进目标

1. ✅ DeepSeek 总结输出为中文
2. ✅ 总结和图片生成分离（可选择是否生成图片）
3. ✅ 支持自定义图片提示词
4. ✅ 支持选择生成图片数量（1-4张）
5. ✅ 支持重新生成总结和图片
6. ✅ 图片结合歌词、名句、风景元素

## 新的用户流程

### 流程 1：生成总结
1. 用户选择时间段
2. 输入 DeepSeek API Key
3. 点击"生成我的总结"
4. 显示统计数据和AI分析（中文）

### 流程 2：生成图片（可选）
1. 总结显示后，出现"图片生成"区域
2. 用户可以：
   - 输入 z-image-turbo API Key
   - 选择图片数量（1-4张）
   - 使用AI自动生成的提示词（默认）
   - 或者自定义提示词
3. 点击"生成图片卡片"
4. 显示生成的图片（多张）

### 流程 3：重新生成
- 在总结区域：点击"重新生成总结"
- 在图片区域：点击"重新生成图片"

## UI 结构

```
┌──────────────────────────────────────┐
│ 配置总结                               │
│ - 时间段选择                           │
│ - DeepSeek API Key                    │
│ - [🚀 生成我的总结]                    │
└──────────────────────────────────────┘

↓ 生成后显示

┌──────────────────────────────────────┐
│ 🎉 你的生活总结        [🔄 重新生成] │
│                                        │
│ [统计卡片 x 4]                        │
│                                        │
│ [AI 分析内容（中文）]                  │
│                                        │
│ ┌────────────────────────────────┐   │
│ │ 📸 生成图片卡片（可选）          │   │
│ │                                  │   │
│ │ z-image-turbo API Key: [____]   │   │
│ │ 图片数量: [2] (1-4张)            │   │
│ │                                  │   │
│ │ ☑ 使用AI自动生成提示词           │   │
│ │ ☐ 自定义提示词                   │   │
│ │   [自定义提示词输入框]            │   │
│ │                                  │   │
│ │ [🎨 生成图片卡片]                 │   │
│ └────────────────────────────────┘   │
│                                        │
│ ↓ 图片生成后                          │
│                                        │
│ 📸 你的专属卡片 (3张) [🔄 重新生成]  │
│ [图片1] [图片2] [图片3]              │
│ [下载全部] [分别下载]                 │
└──────────────────────────────────────┘
```

## 技术实现要点

### 1. 状态管理
```javascript
let currentSummaryData = null;    // 缓存总结数据
let currentAnalysis = null;       // 缓存AI分析
let currentImagePrompt = null;    // 缓存AI生成的图片提示词
let generatedImages = [];         // 缓存生成的图片
```

### 2. 分离的函数
```javascript
async function generateSummary()  // 只生成文字总结
async function generateImages()   // 生成图片（可选）
async function regenerateSummary() // 重新生成总结
async function regenerateImages()  // 重新生成图片
```

### 3. 图片提示词处理
```javascript
function toggleCustomPrompt() {
  // 切换自动/自定义提示词
  const useAI = document.getElementById('use-ai-prompt').checked;
  const customInput = document.getElementById('custom-prompt-input');

  if (useAI) {
    customInput.classList.add('hidden');
    // 使用 currentImagePrompt（AI生成）
  } else {
    customInput.classList.remove('hidden');
    // 使用用户自定义的提示词
  }
}
```

### 4. 多张图片显示
```javascript
function displayImages(images) {
  const container = document.getElementById('image-gallery');
  container.innerHTML = '';

  images.forEach((img, index) => {
    const imageCard = `
      <div class="image-card">
        <img src="${img.url}" alt="卡片 ${index + 1}">
        <div class="actions">
          <a href="${img.url}" download="summary-${index + 1}.png">
            💾 下载图片 ${index + 1}
          </a>
        </div>
      </div>
    `;
    container.innerHTML += imageCard;
  });
}
```

## DeepSeek Prompt（中文）

### 总结生成
```javascript
{
  role: 'system',
  content: '你是一位富有创意的生活总结生成器。请以音乐流媒体平台（如网易云音乐年度总结、QQ音乐年度回顾）的风格，生成个性化的生活总结。请用中文输出，包含创意洞察、趣味事实和激励性的话语。请使用emoji让内容更生动有趣！'
}
```

### 图片提示词生成
```javascript
{
  role: 'system',
  content: '你是一位富有诗意和艺术感的图像提示词生成专家。请创作结合了歌词、诗句、名言名句和风景元素的视觉卡片描述。让每张图片都成为一件艺术作品，既展现数据统计，又蕴含深意。'
},
{
  role: 'user',
  content: `请为第${i+1}张图片创作一个富有诗意的提示词...

  要求：
  - 融入优美的风景元素（山川、湖泊、星空等）
  - 结合一句契合主题的歌词、诗句或名言
  - 使用与心情相配的色调和氛围
  - 包含统计数据的精美呈现
  - 画面要有层次感和故事性

  请只提供中文的图像生成提示词，格式：一段完整流畅的中文描述。`
}
```

## 优化的图片生成策略

### 多样性策略
为每张图片生成不同风格的提示词：

```javascript
const styles = [
  {
    name: '诗意朦胧',
    keywords: '水墨画风格、柔和光线、意境深远、留白艺术'
  },
  {
    name: '明亮清新',
    keywords: '清晨阳光、活力四射、色彩鲜艳、积极向上'
  },
  {
    name: '温暖怀旧',
    keywords: '复古色调、温馨回忆、柔和滤镜、岁月静好'
  },
  {
    name: '梦幻唯美',
    keywords: '星空银河、梦幻光效、浪漫唯美、超现实'
  }
];

// 为每张图片应用不同风格
for (let i = 0; i < imageCount; i++) {
  const style = styles[i % 4];
  const enhancedPrompt = `${basePrompt}\\n\\n风格：${style.name}（${style.keywords}）`;
  // 生成图片...
}
```

## 实现步骤

### Step 1: 修改 UI ✅ 完成
- [x] 已添加图片数量选择框
- [x] 将"生成图片"逻辑移到结果显示区域
- [x] 修改图片显示为画廊模式（支持多张）
- [x] 添加"重新生成总结"按钮
- [x] 添加"重新生成图片"按钮
- [ ] 添加"使用AI提示词/自定义提示词"切换（未来功能）
- [ ] 添加自定义提示词输入框（大文本框）（未来功能）

### Step 2: 修改 JavaScript逻辑 ✅ 完成
- [x] DeepSeek prompt 改为中文
- [x] 图片 prompt 改为创意风格（结合歌词、风景）
- [x] 分离 generateSummary() 和 generateImages()
- [x] 添加状态管理变量
- [x] 实现重新生成功能（regenerateSummary 和 regenerateImages）
- [x] 实现多张图片生成逻辑（支持1-4张，带风格变化）
- [x] 实现图片画廊显示（displayImages）
- [x] 实现下载所有图片功能（downloadAllImages）
- [ ] 实现自定义提示词切换（未来功能）

### Step 3: 测试 ⏳ 待测试
- [ ] 测试中文总结生成
- [ ] 测试图片可选生成
- [ ] 测试多张图片生成（1-4张）
- [ ] 测试重新生成总结功能
- [ ] 测试重新生成图片功能
- [ ] 测试下载所有图片功能

## 下一步

由于修改较大，我建议：

1. **逐步实现**：先完成核心功能，再添加高级功能
2. **保持现有可用**：现有的基本功能继续可用
3. **渐进增强**：用户可以选择使用简单模式或高级模式

或者我可以：
- 创建一个新的 `summary-v2.astro` 页面，包含所有新功能
- 保留原来的 `summary.astro` 作为简单版本
- 用户可以选择使用哪个版本

您希望我：
A. 直接修改现有的 summary.astro（可能需要较多修改）
B. 创建 summary-v2.astro 新版本（更安全）
C. 先完成关键功能（中文输出 + 分离生成），其他功能后续添加

请告诉我您的选择，我会继续实现！
