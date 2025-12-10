import type { MiddlewareHandler } from 'astro';

/**
 * Middleware to add Content Security Policy headers for development
 * This ensures YouTube embeds and other iframes work correctly in dev mode
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Only add CSP headers in development
  if (import.meta.env.DEV) {
    // Set Content Security Policy to allow YouTube embeds, Reveal.js, and other resources
    response.headers.set(
      'Content-Security-Policy',
      // 修改点：在 connect-src 中添加了 https: 和 http: (用于支持 DeepSeek, OpenAI 以及本地 Ollama 等自定义 API)
      // 修改点：在 img-src 中添加了 blob: (用于支持部分图片生成预览)
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://giscus.app https://platform.twitter.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src 'self' data: https: blob:; connect-src 'self' https://giscus.app https://cdn.jsdelivr.net https: http:; frame-src 'self' https://www.youtube.com https://giscus.app https://platform.twitter.com; object-src 'none'; base-uri 'self';"
    );
  }
  
  return response;
};