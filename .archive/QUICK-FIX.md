# 快速修复 - Statistic页面错误

## 问题
```
TypeError: Cannot read properties of undefined (reading 'title')
at /home/chia/Documents/gitrepo/qlog/src/layouts/BaseLayout.astro:54:19
```

## 原因
statistic页面使用了错误的prop传递方式：
```astro
<!-- 错误 -->
<BaseLayout title={pageTitle} description={pageDescription}>

<!-- 正确 -->
<BaseLayout seoData={seoData}>
```

## 修复
在 `src/pages/statistic/index.astro`:

1. 添加 `siteConfig` 导入
2. 创建 `seoData` 对象
3. 正确传递给 `BaseLayout`

## 修复后的代码
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config';  // ← 添加这行

// ... 其他代码 ...

const seoData = {
  title: `${pageTitle} | ${siteConfig.title}`,
  description: pageDescription,
  canonical: Astro.url.href,
  ogType: 'website' as const
};
---

<BaseLayout seoData={seoData}>  <!-- ← 修改这行 -->
```

## 测试
现在可以正常访问：
- http://localhost:5000/statistic/ ✅
- http://localhost:5000/diary/ ✅
- http://localhost:5000/todo/ ✅
- http://localhost:5000/summary/ ✅

所有页面都应该正常工作了！
