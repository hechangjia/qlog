/**
 * AI Providers - AI 服务提供商抽象层
 * 支持 OpenAI 和 Claude API
 */

export interface PostSummary {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  wordCount: number;
}

export interface SummaryPeriod {
  period: string;
  startDate: string;
  endDate: string;
  postCount: number;
  posts: PostSummary[];
}

export type SummaryType = "weekly" | "monthly" | "yearly";

export interface AIProviderConfig {
  provider: "openai" | "claude";
  apiKey: string;
  apiBaseUrl?: string;
  model?: string;
}

export interface AIProvider {
  generateSummary(
    periodData: SummaryPeriod,
    summaryType: SummaryType
  ): Promise<string>;
}

/**
 * 生成总结的 prompt
 */
function generatePrompt(
  periodData: SummaryPeriod,
  summaryType: SummaryType
): string {
  const typeNames: Record<SummaryType, string> = {
    weekly: "周",
    monthly: "月",
    yearly: "年度",
  };

  const typeName = typeNames[summaryType];

  if (periodData.postCount === 0) {
    return `这是一个博客的${typeName}总结请求。在 ${periodData.period} (${periodData.startDate} 至 ${periodData.endDate}) 期间没有发布任何文章。请生成一段简短的鼓励性文字，提醒博主保持写作习惯。用中文回复，控制在100字以内。`;
  }

  const postsInfo = periodData.posts
    .map(
      (p) =>
        `- 《${p.title}》(${p.date})${p.tags.length > 0 ? `，标签：${p.tags.join("、")}` : ""}${p.description ? `，简介：${p.description}` : ""}`
    )
    .join("\n");

  return `你是一个博客写作助手。请为以下博客的${typeName}内容生成一段总结。

时间段：${periodData.period} (${periodData.startDate} 至 ${periodData.endDate})
文章数量：${periodData.postCount} 篇

发布的文章：
${postsInfo}

请生成一段${typeName}总结，包括：
1. 本${typeName.replace("度", "")}的写作概况
2. 主要内容主题
3. 值得关注的亮点
${summaryType === "yearly" ? "4. 年度回顾感想" : ""}

要求：
- 用中文回复
- 语言简洁、积极向上
- 控制在 ${summaryType === "yearly" ? "300" : "150"} 字以内
- 不要使用 markdown 格式，直接输出纯文本`;
}

/**
 * OpenAI Provider
 */
class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.apiBaseUrl || "https://api.openai.com/v1";
    this.model = config.model || "gpt-4o-mini";
  }

  async generateSummary(
    periodData: SummaryPeriod,
    summaryType: SummaryType
  ): Promise<string> {
    const prompt = generatePrompt(periodData, summaryType);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "你是一个专业的博客写作助手，擅长总结和分析内容。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "无法生成总结";
  }
}

/**
 * Claude Provider
 */
class ClaudeProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.apiBaseUrl || "https://api.anthropic.com/v1";
    this.model = config.model || "claude-3-haiku-20240307";
  }

  async generateSummary(
    periodData: SummaryPeriod,
    summaryType: SummaryType
  ): Promise<string> {
    const prompt = generatePrompt(periodData, summaryType);

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "无法生成总结";
  }
}

/**
 * 获取 AI 提供商实例
 */
export function getAIProvider(config: AIProviderConfig): AIProvider {
  switch (config.provider) {
    case "openai":
      return new OpenAIProvider(config);
    case "claude":
      return new ClaudeProvider(config);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

/**
 * 检查 AI 配置是否有效
 */
export function isAIConfigValid(config: Partial<AIProviderConfig>): boolean {
  return !!(
    config.provider &&
    config.provider !== "none" &&
    config.apiKey &&
    config.apiKey.trim() !== ""
  );
}

/**
 * 获取默认模型名称
 */
export function getDefaultModel(provider: "openai" | "claude"): string {
  return provider === "openai" ? "gpt-4o-mini" : "claude-3-haiku-20240307";
}
