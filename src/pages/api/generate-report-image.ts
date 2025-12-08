import type { APIRoute } from "astro";

export const prerender = false;

interface ImageRequest {
  slideType: string;
  reportData: {
    year: number;
    totalPosts: number;
    totalWords: number;
    topTags: string[];
    mostProductiveMonth: string;
    favoriteWritingDay: string;
    longestPostTitle: string;
    longestPostWords: number;
    firstPostTitle: string;
    firstPostDate: string;
  };
}

const GITEE_AI_BASE_URL = "https://ai.gitee.com/v1";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const IMAGE_MODEL = "z-image-turbo";

// 使用 DeepSeek 生成图片提示词
async function generatePromptWithDeepSeek(
  slideType: string,
  reportData: ImageRequest["reportData"],
  deepseekApiKey: string
): Promise<string> {
  const slideDescriptions: Record<string, string> = {
    welcome: `年度欢迎页，展示 ${reportData.year} 年的写作回顾开始`,
    overview: `年度概览，这一年共写了 ${reportData.totalPosts} 篇文章，${reportData.totalWords} 字`,
    firstPost: `第一篇文章页面，标题是"${reportData.firstPostTitle}"，发布于 ${reportData.firstPostDate}`,
    productive: `最高产月份页面，${reportData.mostProductiveMonth} 是写作最多的月份`,
    habit: `写作习惯页面，最喜欢在 ${reportData.favoriteWritingDay} 写作`,
    tags: `热门标签页面，最常用的标签有：${reportData.topTags.join("、")}`,
    longest: `最长文章页面，"${reportData.longestPostTitle}" 共 ${reportData.longestPostWords} 字`,
    funFacts: `趣味数据页面，展示有趣的写作统计`,
    final: `年度总结页面，感谢 ${reportData.year} 年的每一次记录，期待 ${reportData.year + 1} 年`,
  };

  const slideContext = slideDescriptions[slideType] || "年度报告卡片";

  const systemPrompt = `你是一个专业的AI绘画提示词生成专家。你需要根据用户提供的年度写作报告卡片信息，生成一个用于AI绘图的英文提示词。

要求：
1. 生成的提示词必须是英文
2. 风格要求：极简主义、高级感、柔和渐变背景、适合作为文字卡片背景
3. 不要包含任何文字、人物、具体物体
4. 使用抽象艺术风格，体现数据可视化和写作主题
5. 根据卡片类型选择合适的色调和意境
6. 提示词长度控制在50-100个英文单词
7. 只输出提示词，不要任何解释`;

  const userPrompt = `请为以下年度写作报告卡片生成一个AI绘图提示词：

卡片类型：${slideType}
卡片内容：${slideContext}
年份：${reportData.year}
总文章数：${reportData.totalPosts}
总字数：${reportData.totalWords}

请生成一个适合作为这张卡片背景的AI绘图提示词。`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedPrompt = result.choices?.[0]?.message?.content?.trim();

    if (!generatedPrompt) {
      throw new Error("DeepSeek did not return a valid prompt");
    }

    return generatedPrompt;
  } catch (error) {
    console.error("DeepSeek prompt generation failed:", error);
    // 返回默认提示词
    return getDefaultPrompt(slideType, reportData);
  }
}

// 默认提示词（当 DeepSeek 不可用时使用）
function getDefaultPrompt(
  slideType: string,
  reportData: ImageRequest["reportData"]
): string {
  const baseStyle =
    "minimalist abstract art, soft gradient background, elegant, suitable as text card background, no text, no people, high quality, 4k";

  const prompts: Record<string, string> = {
    welcome: `${baseStyle}, celebration theme, golden and deep blue gradient, starlight elements, new year atmosphere, ${reportData.year} annual review mood`,
    overview: `${baseStyle}, data visualization theme, tech feel, light blue and purple gradient, geometric shapes, achievement and accomplishment feeling`,
    firstPost: `${baseStyle}, beginning theme, sunrise imagery, orange and pink gradient, hope and start atmosphere, warm tones`,
    productive: `${baseStyle}, productivity theme, energetic colors, growth and effort symbols, dynamic composition`,
    habit: `${baseStyle}, time theme, abstract clock or calendar imagery, teal and blue tones, rhythm and routine feeling`,
    tags: `${baseStyle}, tag cloud theme, colorful but harmonious, connection and classification imagery, knowledge network feeling`,
    longest: `${baseStyle}, long-form writing theme, book or scroll imagery, elegant brown and gold, immersive writing atmosphere`,
    funFacts: `${baseStyle}, fun facts theme, playful design, soft rainbow gradient, surprise and discovery atmosphere`,
    final: `${baseStyle}, year-end summary theme, celebration and gratitude, golden glow, transition from ${reportData.year} to ${reportData.year + 1}, warm and cozy feeling`,
  };

  return prompts[slideType] || baseStyle;
}

// 使用 Z-Image 生成图片
async function generateImageWithZImage(
  prompt: string,
  giteeApiKey: string
): Promise<string> {
  const response = await fetch(`${GITEE_AI_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${giteeApiKey}`,
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: prompt,
      size: "1024x576",
      n: 1,
      response_format: "url",
      negative_prompt:
        "low quality, blurry, distorted, text, watermark, signature, ugly, deformed",
      num_inference_steps: 12,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Z-Image API error:", errorText);
    throw new Error(`Z-Image API error: ${response.status}`);
  }

  const result = await response.json();

  if (result.data && result.data[0]) {
    return result.data[0].url || result.data[0].b64_json;
  }

  throw new Error("Z-Image did not return a valid image");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const giteeApiKey = import.meta.env.GITEE_AI_API_KEY;
    const deepseekApiKey = import.meta.env.DEEPSEEK_API_KEY;

    if (!giteeApiKey) {
      return new Response(
        JSON.stringify({
          error: "GITEE_AI_API_KEY 环境变量未配置",
          hint: "请在 .env 文件中设置 GITEE_AI_API_KEY",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body: ImageRequest = await request.json();
    const { slideType, reportData } = body;

    if (!slideType || !reportData) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数 slideType 或 reportData" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: 使用 DeepSeek 生成提示词（如果有 API Key）
    let prompt: string;
    let promptSource: string;

    if (deepseekApiKey) {
      try {
        prompt = await generatePromptWithDeepSeek(
          slideType,
          reportData,
          deepseekApiKey
        );
        promptSource = "deepseek";
      } catch (error) {
        console.warn("DeepSeek failed, using default prompt");
        prompt = getDefaultPrompt(slideType, reportData);
        promptSource = "default";
      }
    } else {
      prompt = getDefaultPrompt(slideType, reportData);
      promptSource = "default";
    }

    // Step 2: 使用 Z-Image 生成图片
    const imageUrl = await generateImageWithZImage(prompt, giteeApiKey);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        slideType: slideType,
        prompt: prompt,
        promptSource: promptSource,
        generatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "生成图片时发生错误",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// GET 请求返回 API 状态
export const GET: APIRoute = async () => {
  const giteeApiKey = import.meta.env.GITEE_AI_API_KEY;
  const deepseekApiKey = import.meta.env.DEEPSEEK_API_KEY;

  return new Response(
    JSON.stringify({
      enabled: !!giteeApiKey,
      imageProvider: "gitee-ai (z-image-turbo)",
      promptProvider: deepseekApiKey ? "deepseek" : "default",
      hasGiteeKey: !!giteeApiKey,
      hasDeepSeekKey: !!deepseekApiKey,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    }
  );
};
