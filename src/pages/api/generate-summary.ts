import type { APIRoute } from "astro";
import { siteConfig } from "@/config";
import {
  getAIProvider,
  isAIConfigValid,
  type SummaryType,
  type SummaryPeriod,
} from "@/utils/ai-providers";

export const prerender = false;

interface SummaryRequest {
  type: SummaryType;
}

interface SummaryData {
  weekly: SummaryPeriod;
  monthly: SummaryPeriod;
  yearly: SummaryPeriod;
  generatedAt: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 检查 AI 配置
    const aiConfig = siteConfig.statsFeatures?.aiSummary;

    if (!aiConfig?.enabled) {
      return new Response(
        JSON.stringify({ error: "AI 总结功能未启用" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (
      !isAIConfigValid({
        provider: aiConfig.provider as "openai" | "claude",
        apiKey: aiConfig.apiKey,
      })
    ) {
      return new Response(
        JSON.stringify({ error: "AI 配置无效，请检查 API key 和提供商设置" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 解析请求
    const body: SummaryRequest = await request.json();
    const summaryType = body.type;

    if (!["weekly", "monthly", "yearly"].includes(summaryType)) {
      return new Response(
        JSON.stringify({ error: "无效的总结类型" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 检查是否启用了该类型的总结
    if (!aiConfig.summaryTypes?.[summaryType]) {
      return new Response(
        JSON.stringify({ error: `${summaryType} 总结未启用` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 获取总结数据
    let summaryData: SummaryData;
    try {
      const response = await fetch(new URL("/stats/summary-data.json", request.url));
      if (!response.ok) {
        throw new Error("Failed to load summary data");
      }
      summaryData = await response.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "无法加载统计数据，请先运行构建脚本" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 获取对应时间段的数据
    const periodData = summaryData[summaryType];

    if (!periodData) {
      return new Response(
        JSON.stringify({ error: "没有找到对应的统计数据" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 获取 AI 提供商并生成总结
    const provider = getAIProvider({
      provider: aiConfig.provider as "openai" | "claude",
      apiKey: aiConfig.apiKey,
      apiBaseUrl: aiConfig.apiBaseUrl,
      model: aiConfig.model,
    });

    const summary = await provider.generateSummary(periodData, summaryType);

    return new Response(
      JSON.stringify({
        success: true,
        type: summaryType,
        period: periodData.period,
        postCount: periodData.postCount,
        summary,
        generatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=300", // 缓存 5 分钟
        },
      }
    );
  } catch (error) {
    console.error("AI Summary error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "生成总结时发生错误",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// GET 请求返回当前配置状态
export const GET: APIRoute = async () => {
  const aiConfig = siteConfig.statsFeatures?.aiSummary;

  return new Response(
    JSON.stringify({
      enabled: aiConfig?.enabled ?? false,
      provider: aiConfig?.provider ?? "none",
      hasApiKey: !!(aiConfig?.apiKey && aiConfig.apiKey.trim() !== ""),
      summaryTypes: aiConfig?.summaryTypes ?? {
        weekly: false,
        monthly: false,
        yearly: false,
      },
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
