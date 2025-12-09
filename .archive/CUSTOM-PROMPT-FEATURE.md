# 🎨 自定义提示词功能实现总结

## ✅ 新增功能

### 1. **提示词模式选择**
用户现在可以在两种模式之间选择：

#### 🤖 AI自动生成提示词（默认）
- AI基于总结内容自动生成富有诗意的图片提示词
- 自动结合：
  - 歌词和名句
  - 优美的风景元素
  - 心情和氛围
  - 统计数据的艺术化呈现
- 生成后会显示**提示词预览**，可以查看AI生成的内容
- 支持**一键复制**提示词到剪贴板

#### ✏️ 自定义提示词
- 完全自定义图片生成的提示词
- 提供详细的示例和提示
- 6行大文本框，方便输入长文本
- 支持任意创意表达

### 2. **AI提示词预览**
- 使用AI模式时，会显示AI生成的提示词
- 提供"📋 复制"按钮，方便保存和修改
- 最大高度限制，长文本可滚动查看
- 优雅的背景样式，易于阅读

### 3. **智能切换**
- 两种模式通过单选按钮切换
- 切换时UI自动显示/隐藏相应输入框
- 保持用户体验流畅

## 📝 UI设计

### 提示词设置区域

```
📝 图片提示词设置
├─ 🤖 使用AI自动生成提示词（默认选中）
│  └─ AI将基于您的总结内容，自动生成富有诗意、结合歌词和风景的提示词
│
├─ ✏️ 自定义提示词
│  └─ 完全自定义图片生成的提示词，发挥您的创意
│
└─ [自定义提示词输入框]（选择自定义时显示）
   ├─ 6行文本框
   ├─ 详细占位符示例
   └─ 使用提示

[AI生成的提示词预览]（使用AI模式且已生成时显示）
├─ 提示词内容显示
└─ [📋 复制] 按钮
```

### 示例占位符

```
一幅唯美的总结卡片，画面中央是温暖的渐变背景，从日出的金黄色过渡到天空的浅蓝色。前景是一座宁静的山川湖泊，远处有飘渺的云雾。画面上优雅地展示统计数据，用现代简约的图标和数字呈现。顶部用书法字体写着一句契合主题的诗句：'山高水长，岁月静好'。整体风格温馨而富有艺术感，类似音乐流媒体的年度总结卡片。
```

## 🔧 技术实现

### 1. HTML结构

#### 模式选择单选按钮
```html
<input type="radio" id="use-ai-prompt" name="prompt-mode" value="ai" checked onchange="togglePromptMode()" />
<input type="radio" id="use-custom-prompt" name="prompt-mode" value="custom" onchange="togglePromptMode()" />
```

#### 自定义提示词输入框
```html
<textarea id="custom-prompt-input" rows="6" class="..." placeholder="..."></textarea>
```

#### AI提示词预览
```html
<div id="ai-prompt-preview" class="hidden">
  <div id="ai-prompt-content"></div>
  <button onclick="copyPromptToClipboard()">📋 复制</button>
</div>
```

### 2. JavaScript函数

#### `togglePromptMode()`
```javascript
function togglePromptMode() {
  const promptMode = document.querySelector('input[name="prompt-mode"]:checked').value;
  const customContainer = document.getElementById('custom-prompt-container');

  if (promptMode === 'custom') {
    customContainer.classList.remove('hidden');
  } else {
    customContainer.classList.add('hidden');
  }
}
```

#### `copyPromptToClipboard()`
```javascript
function copyPromptToClipboard() {
  const promptText = document.getElementById('ai-prompt-content').textContent;

  navigator.clipboard.writeText(promptText).then(() => {
    // 显示"✓ 已复制"反馈
    button.textContent = '✓ 已复制';
    setTimeout(() => { button.textContent = originalText; }, 2000);
  });
}
```

#### `generateImages()` 修改
```javascript
async function generateImages() {
  const promptMode = document.querySelector('input[name="prompt-mode"]:checked').value;

  let baseImagePrompt = '';

  if (promptMode === 'custom') {
    // 使用自定义提示词
    baseImagePrompt = document.getElementById('custom-prompt-input').value.trim();
    if (!baseImagePrompt) {
      showError('请输入自定义提示词');
      return;
    }
  } else {
    // 使用AI生成提示词
    // ... 调用DeepSeek API ...
    // 显示提示词预览
    document.getElementById('ai-prompt-content').textContent = baseImagePrompt;
    document.getElementById('ai-prompt-preview').classList.remove('hidden');
  }

  // 继续生成图片...
}
```

## 🎯 使用流程

### 方式1：使用AI提示词（推荐）

1. 生成总结后，选择 **"🤖 使用AI自动生成提示词"**（默认）
2. 输入z-image-turbo API Key
3. 选择图片数量
4. 点击 **"🎨 生成图片卡片"**
5. AI会先生成提示词，然后显示在"AI生成的提示词预览"区域
6. 可以点击 **"📋 复制"** 保存提示词
7. 图片生成完成后显示在画廊中

### 方式2：使用自定义提示词

1. 生成总结后，选择 **"✏️ 自定义提示词"**
2. 文本框会展开，输入自己的提示词
3. 参考占位符中的示例格式
4. 输入z-image-turbo API Key
5. 选择图片数量
6. 点击 **"🎨 生成图片卡片"**
7. 图片会基于自定义提示词生成

### 方式3：混合使用

1. 先用AI模式生成，查看AI生成的提示词
2. 点击 **"📋 复制"** 复制提示词
3. 切换到 **"✏️ 自定义提示词"** 模式
4. 粘贴AI提示词并进行修改
5. 重新生成图片

## 💡 使用建议

### 自定义提示词编写技巧

1. **描述场景**：详细描述画面元素
   ```
   一幅温馨的总结卡片，背景是渐变的日落色调...
   ```

2. **指定风格**：明确艺术风格
   ```
   水墨画风格、现代简约、扁平插画、3D渲染...
   ```

3. **添加文字**：指定要显示的文字内容
   ```
   顶部用书法字体写着："岁月静好，现世安稳"
   ```

4. **包含数据**：要求展示统计数据
   ```
   画面中央用图标和数字展示：5篇日记，3个完成的待办
   ```

5. **设定氛围**：描述情感和氛围
   ```
   整体氛围温暖宁静，给人以平和安详的感觉
   ```

### 最佳实践

✅ **推荐做法**
- 第一次使用AI模式，了解提示词结构
- 复制AI提示词后进行微调
- 提示词长度150-300字为宜
- 多次尝试不同风格

❌ **避免**
- 提示词过短（少于50字）
- 描述过于抽象或模糊
- 包含不相关的元素
- 要求生成文字内容（z-image-turbo对中文文字支持有限）

## 📊 功能对比

| 特性 | AI自动生成 | 自定义提示词 |
|------|-----------|------------|
| 使用难度 | ⭐ 简单 | ⭐⭐⭐ 需要经验 |
| 个性化程度 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 非常高 |
| 生成速度 | ⭐⭐⭐ 较快（需生成提示词） | ⭐⭐⭐⭐⭐ 快（直接生成图片） |
| 结果质量 | ⭐⭐⭐⭐ 稳定 | ⭐⭐⭐⭐⭐ 取决于提示词质量 |
| 适用场景 | 快速生成、首次使用 | 有明确想法、精细控制 |

## 🎉 改进点

相比之前版本的提升：

1. ✅ **用户控制力更强**：可以完全自定义提示词
2. ✅ **透明度更高**：显示AI生成的提示词，用户知道图片如何生成
3. ✅ **灵活性更好**：可以在AI基础上修改，结合两种方式优势
4. ✅ **学习友好**：通过查看AI提示词，用户可以学习如何写好提示词
5. ✅ **迭代优化**：可以基于上次的提示词持续改进

## 📝 修改的文件

1. **src/pages/summary.astro**
   - 添加提示词模式选择UI（单选按钮）
   - 添加自定义提示词输入框
   - 添加AI提示词预览区域
   - 修改 `generateImages()` 函数支持两种模式
   - 新增 `togglePromptMode()` 函数
   - 新增 `copyPromptToClipboard()` 函数

2. **add-custom-prompt-support.py** (工具脚本)
   - Python脚本用于自动修改代码

## 🚀 下一步建议

### 可以继续改进的功能

1. **提示词模板库**
   - 预设多个提示词模板供用户选择
   - 不同风格：文艺、商务、可爱、复古等

2. **提示词编辑器增强**
   - 语法高亮
   - 提示词长度统计
   - 关键词建议

3. **历史提示词保存**
   - 保存最近使用的提示词
   - 提示词收藏功能

4. **图片-提示词关联**
   - 在图片下方显示使用的提示词
   - 点击图片可以查看和重用提示词

5. **提示词分享**
   - 导出提示词为JSON
   - 导入他人分享的提示词

## ✨ 总结

这次更新为z-image-turbo图片生成添加了强大的自定义能力：

- 🎨 **双模式支持**：AI自动生成 + 完全自定义
- 👀 **提示词可见**：AI生成的提示词可以查看和复制
- 🔄 **灵活切换**：随时在两种模式间切换
- 📝 **友好提示**：详细的占位符示例和使用说明
- ✅ **完全控制**：想要什么样的图片，完全由用户决定

用户现在可以：
1. 快速使用AI模式生成专业提示词
2. 查看和学习AI如何构建提示词
3. 基于AI提示词进行微调
4. 完全从零编写自己的创意提示词

这大大提升了图片生成的灵活性和可控性！🎊
