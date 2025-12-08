#!/usr/bin/env node

/**
 * Stats Data Generation Script
 *
 * 生成热力图和 AI 总结所需的统计数据：
 * - heatmap-data.json: 日历热力图数据（按日期统计文章数量）
 * - summary-data.json: AI 总结所需的文章摘要数据
 *
 * 数据格式：
 * heatmap: { "2024-01-15": 2, "2024-01-20": 1, ... }
 * summaryData: {
 *   weekly: { posts: [...], period: "2024-W03", startDate, endDate },
 *   monthly: { posts: [...], period: "2024-01", startDate, endDate },
 *   yearly: { posts: [...], period: "2024", startDate, endDate }
 * }
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Configuration
const OUTPUT_DIR = join(projectRoot, "public", "stats");
const HEATMAP_FILE = join(OUTPUT_DIR, "heatmap-data.json");
const SUMMARY_FILE = join(OUTPUT_DIR, "summary-data.json");

// Simple logging utility
const isDev = process.env.NODE_ENV !== "production";
const log = {
  info: (...args) => isDev && console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
};

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Read stats features configuration from config file
 */
function getStatsConfig() {
  try {
    const configPath = join(projectRoot, "src", "config.ts");
    const configContent = readFileSync(configPath, "utf-8");

    // Extract heatmap enabled
    const heatmapEnabledMatch = configContent.match(
      /heatmap:\s*\{[^}]*enabled:\s*(true|false)/s
    );
    const heatmapEnabled = heatmapEnabledMatch
      ? heatmapEnabledMatch[1] === "true"
      : true;

    // Extract aiSummary enabled
    const aiSummaryEnabledMatch = configContent.match(
      /aiSummary:\s*\{[^}]*enabled:\s*(true|false)/s
    );
    const aiSummaryEnabled = aiSummaryEnabledMatch
      ? aiSummaryEnabledMatch[1] === "true"
      : false;

    // Extract autoGenerate
    const autoGenerateMatch = configContent.match(
      /autoGenerate:\s*(true|false)/
    );
    const autoGenerate = autoGenerateMatch
      ? autoGenerateMatch[1] === "true"
      : false;

    return {
      heatmapEnabled,
      aiSummaryEnabled,
      autoGenerate,
    };
  } catch (error) {
    log.warn("Could not read config file, using defaults");
    return {
      heatmapEnabled: true,
      aiSummaryEnabled: false,
      autoGenerate: false,
    };
  }
}

/**
 * Parse markdown file and extract frontmatter and content
 */
function parseMarkdownFile(content, slug) {
  try {
    // Extract frontmatter
    const frontmatterMatch = content.match(
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );
    if (!frontmatterMatch) {
      return null;
    }

    const [, frontmatter, body] = frontmatterMatch;
    const lines = frontmatter.split(/\r?\n/);
    const data = {};

    // Parse frontmatter
    let currentKey = null;
    let currentArray = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (!trimmedLine) continue;

      const colonIndex = line.indexOf(":");
      if (colonIndex > 0 && !line.startsWith(" ")) {
        if (currentKey && currentArray.length > 0) {
          data[currentKey] = [...currentArray];
          currentArray = [];
        }

        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Check if this is an array key
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith("- ")) {
          currentKey = key;
          currentArray = [];
        } else {
          if (key === "date") {
            data[key] = new Date(value);
          } else if (key === "draft") {
            data[key] = value === "true";
          } else {
            data[key] = value;
          }
        }
      } else if (trimmedLine.startsWith("- ")) {
        const item = trimmedLine.substring(2).trim();
        currentArray.push(item);
      }
    }

    if (currentKey && currentArray.length > 0) {
      data[currentKey] = [...currentArray];
    }

    return {
      id: slug,
      data,
      body,
    };
  } catch (error) {
    log.warn(`Error parsing file ${slug}:`, error.message);
    return null;
  }
}

/**
 * Read all posts from content directory
 */
function readContentFiles(dirPath) {
  const posts = [];

  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stat = statSync(itemPath);

      if (stat.isDirectory()) {
        const indexPath = join(itemPath, "index.md");
        if (existsSync(indexPath)) {
          const content = readFileSync(indexPath, "utf-8");
          const parsed = parseMarkdownFile(content, item);
          if (parsed) {
            posts.push(parsed);
          }
        }
      } else if (item.endsWith(".md")) {
        const content = readFileSync(itemPath, "utf-8");
        const slug = item.replace(".md", "");
        const parsed = parseMarkdownFile(content, slug);
        if (parsed) {
          posts.push(parsed);
        }
      }
    }
  } catch (error) {
    log.error("Error reading content directory:", error);
  }

  return posts;
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

/**
 * Get week start and end dates
 */
function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  const startDate = new Date(d.setDate(diff));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return { startDate, endDate };
}

/**
 * Get month start and end dates
 */
function getMonthRange(date) {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { startDate, endDate };
}

/**
 * Get year start and end dates
 */
function getYearRange(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const endDate = new Date(date.getFullYear(), 11, 31);
  return { startDate, endDate };
}

/**
 * Generate heatmap data
 */
function generateHeatmapData(posts) {
  const heatmap = {};

  for (const post of posts) {
    if (!post.data.date) continue;

    const dateStr = formatDate(post.data.date);
    heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
  }

  return heatmap;
}

/**
 * Generate summary data for AI
 */
function generateSummaryData(posts) {
  const now = new Date();

  // Sort posts by date (newest first)
  const sortedPosts = posts
    .filter((p) => p.data.date)
    .sort((a, b) => b.data.date - a.data.date);

  // Prepare post summaries (title, date, description, tags, word count)
  const preparePostSummary = (post) => ({
    id: post.id,
    title: post.data.title || "Untitled",
    date: formatDate(post.data.date),
    description: post.data.description || "",
    tags: post.data.tags || [],
    wordCount: post.body ? post.body.split(/\s+/).length : 0,
  });

  // Current week
  const { startDate: weekStart, endDate: weekEnd } = getWeekRange(now);
  const weekPosts = sortedPosts.filter((p) => {
    const d = p.data.date;
    return d >= weekStart && d <= weekEnd;
  });

  // Current month
  const { startDate: monthStart, endDate: monthEnd } = getMonthRange(now);
  const monthPosts = sortedPosts.filter((p) => {
    const d = p.data.date;
    return d >= monthStart && d <= monthEnd;
  });

  // Current year
  const { startDate: yearStart, endDate: yearEnd } = getYearRange(now);
  const yearPosts = sortedPosts.filter((p) => {
    const d = p.data.date;
    return d >= yearStart && d <= yearEnd;
  });

  return {
    weekly: {
      period: `${now.getFullYear()}-W${String(getWeekNumber(now)).padStart(2, "0")}`,
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
      postCount: weekPosts.length,
      posts: weekPosts.map(preparePostSummary),
    },
    monthly: {
      period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      startDate: formatDate(monthStart),
      endDate: formatDate(monthEnd),
      postCount: monthPosts.length,
      posts: monthPosts.map(preparePostSummary),
    },
    yearly: {
      period: `${now.getFullYear()}`,
      startDate: formatDate(yearStart),
      endDate: formatDate(yearEnd),
      postCount: yearPosts.length,
      posts: yearPosts.map(preparePostSummary),
    },
    // All time stats
    allTime: {
      totalPosts: sortedPosts.length,
      firstPostDate: sortedPosts.length > 0
        ? formatDate(sortedPosts[sortedPosts.length - 1].data.date)
        : null,
      lastPostDate: sortedPosts.length > 0
        ? formatDate(sortedPosts[0].data.date)
        : null,
    },
    generatedAt: now.toISOString(),
  };
}

/**
 * Main function
 */
async function generateStatsData() {
  log.info("📊 Generating stats data...");

  try {
    const config = getStatsConfig();

    // Read all posts
    const postsDir = join(projectRoot, "src", "content", "posts");
    log.info("📁 Reading posts from:", postsDir);

    const posts = readContentFiles(postsDir);
    log.info(`📄 Found ${posts.length} posts`);

    // Filter out draft posts in production
    const visiblePosts = posts.filter((post) => isDev || !post.data.draft);
    log.info(`📄 Processing ${visiblePosts.length} visible posts`);

    // Generate heatmap data
    if (config.heatmapEnabled) {
      const heatmapData = generateHeatmapData(visiblePosts);
      const heatmapOutput = {
        data: heatmapData,
        totalPosts: visiblePosts.length,
        generatedAt: new Date().toISOString(),
      };
      writeFileSync(HEATMAP_FILE, JSON.stringify(heatmapOutput, null, 2));
      log.info("✅ Heatmap data generated:", HEATMAP_FILE);
      log.info(
        `   📅 ${Object.keys(heatmapData).length} unique dates with posts`
      );
    }

    // Generate summary data (always generate for potential AI use)
    const summaryData = generateSummaryData(visiblePosts);
    writeFileSync(SUMMARY_FILE, JSON.stringify(summaryData, null, 2));
    log.info("✅ Summary data generated:", SUMMARY_FILE);
    log.info(`   📊 Weekly: ${summaryData.weekly.postCount} posts`);
    log.info(`   📊 Monthly: ${summaryData.monthly.postCount} posts`);
    log.info(`   📊 Yearly: ${summaryData.yearly.postCount} posts`);

    log.info("🎉 Stats data generation complete!");
  } catch (error) {
    log.error("❌ Error generating stats data:", error);
    process.exit(1);
  }
}

// Run the script
generateStatsData();
