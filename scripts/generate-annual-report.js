#!/usr/bin/env node

/**
 * Annual Report Data Generation Script
 *
 * 生成年度总结报告所需的统计数据，类似网易云音乐/QQ音乐年度报告风格
 *
 * 输出文件: public/stats/annual-report.json
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
const REPORT_FILE = join(OUTPUT_DIR, "annual-report.json");

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse markdown file and extract frontmatter and content
 */
function parseMarkdownFile(content, slug) {
  try {
    const frontmatterMatch = content.match(
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );
    if (!frontmatterMatch) {
      return null;
    }

    const [, frontmatter, body] = frontmatterMatch;
    const lines = frontmatter.split(/\r?\n/);
    const data = {};

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

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

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
    console.error("Error reading content directory:", error);
  }

  return posts;
}

/**
 * Calculate word count for Chinese text
 */
function countWords(text) {
  if (!text) return 0;
  // Remove markdown syntax
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]+`/g, '') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/[#*_~>\-]/g, '') // markdown symbols
    .replace(/\s+/g, ''); // whitespace

  // Count Chinese characters + English words
  const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;

  return chineseChars + englishWords;
}

/**
 * Get month name in Chinese
 */
function getMonthName(month) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months[month];
}

/**
 * Get day of week in Chinese
 */
function getDayOfWeek(day) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[day];
}

/**
 * Generate annual report data
 */
function generateAnnualReport(posts, year) {
  const yearPosts = posts
    .filter(p => p.data.date && p.data.date.getFullYear() === year)
    .sort((a, b) => a.data.date - b.data.date);

  if (yearPosts.length === 0) {
    return null;
  }

  // Basic stats
  const totalPosts = yearPosts.length;
  const totalWords = yearPosts.reduce((sum, p) => sum + countWords(p.body), 0);

  // Monthly distribution
  const monthlyStats = Array(12).fill(0).map(() => ({ count: 0, words: 0 }));
  yearPosts.forEach(p => {
    const month = p.data.date.getMonth();
    monthlyStats[month].count++;
    monthlyStats[month].words += countWords(p.body);
  });

  // Find most productive month
  let maxMonth = 0;
  let maxCount = 0;
  monthlyStats.forEach((stat, i) => {
    if (stat.count > maxCount) {
      maxCount = stat.count;
      maxMonth = i;
    }
  });

  // Day of week distribution
  const weekdayStats = Array(7).fill(0);
  yearPosts.forEach(p => {
    weekdayStats[p.data.date.getDay()]++;
  });

  // Find favorite writing day
  let favDay = 0;
  let favDayCount = 0;
  weekdayStats.forEach((count, i) => {
    if (count > favDayCount) {
      favDayCount = count;
      favDay = i;
    }
  });

  // Tag analysis
  const tagCounts = {};
  yearPosts.forEach(p => {
    const tags = p.data.tags || [];
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  // Find longest post
  let longestPost = yearPosts[0];
  let longestWords = 0;
  yearPosts.forEach(p => {
    const words = countWords(p.body);
    if (words > longestWords) {
      longestWords = words;
      longestPost = p;
    }
  });

  // Find first and last post
  const firstPost = yearPosts[0];
  const lastPost = yearPosts[yearPosts.length - 1];

  // Writing streak analysis
  const dates = yearPosts.map(p => {
    const d = p.data.date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const uniqueDates = [...new Set(dates)].sort();

  // Calculate longest streak
  let longestStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Late night writing (after 22:00)
  // Since we don't have time info, we'll skip this

  // Generate fun comparisons
  const avgWordsPerPost = Math.round(totalWords / totalPosts);
  const booksEquivalent = Math.round(totalWords / 50000 * 10) / 10; // Assuming 50k words per book
  const pagesEquivalent = Math.round(totalWords / 300); // ~300 words per page

  return {
    year,
    generatedAt: new Date().toISOString(),

    // Overview
    overview: {
      totalPosts,
      totalWords,
      avgWordsPerPost,
      uniqueDays: uniqueDates.length,
      longestStreak,
    },

    // Highlights
    highlights: {
      firstPost: {
        title: firstPost.data.title,
        date: firstPost.data.date.toISOString().split('T')[0],
        id: firstPost.id,
      },
      lastPost: {
        title: lastPost.data.title,
        date: lastPost.data.date.toISOString().split('T')[0],
        id: lastPost.id,
      },
      longestPost: {
        title: longestPost.data.title,
        words: longestWords,
        id: longestPost.id,
      },
      mostProductiveMonth: {
        month: maxMonth,
        monthName: getMonthName(maxMonth),
        count: maxCount,
      },
      favoriteWritingDay: {
        day: favDay,
        dayName: getDayOfWeek(favDay),
        count: favDayCount,
      },
    },

    // Tags
    tags: {
      totalUnique: Object.keys(tagCounts).length,
      topTags,
    },

    // Monthly breakdown
    monthly: monthlyStats.map((stat, i) => ({
      month: i,
      monthName: getMonthName(i),
      count: stat.count,
      words: stat.words,
    })),

    // Weekly breakdown
    weekly: weekdayStats.map((count, i) => ({
      day: i,
      dayName: getDayOfWeek(i),
      count,
    })),

    // Fun facts
    funFacts: {
      booksEquivalent,
      pagesEquivalent,
      avgPostsPerMonth: Math.round(totalPosts / 12 * 10) / 10,
      wordsPerDay: Math.round(totalWords / 365),
    },

    // All posts list for reference
    posts: yearPosts.map(p => ({
      id: p.id,
      title: p.data.title,
      date: p.data.date.toISOString().split('T')[0],
      tags: p.data.tags || [],
      words: countWords(p.body),
    })),
  };
}

/**
 * Main function
 */
async function main() {
  console.log("📊 Generating annual report data...");

  try {
    const postsDir = join(projectRoot, "src", "content", "posts");
    const posts = readContentFiles(postsDir);

    // Filter out drafts
    const visiblePosts = posts.filter(p => !p.data.draft && p.data.date);

    console.log(`📄 Found ${visiblePosts.length} published posts`);

    // Get available years
    const years = [...new Set(visiblePosts.map(p => p.data.date.getFullYear()))].sort((a, b) => b - a);

    if (years.length === 0) {
      console.log("⚠️ No posts with dates found");
      writeFileSync(REPORT_FILE, JSON.stringify({ years: [], reports: {} }, null, 2));
      return;
    }

    console.log(`📅 Years with posts: ${years.join(', ')}`);

    // Generate report for each year
    const reports = {};
    for (const year of years) {
      const report = generateAnnualReport(visiblePosts, year);
      if (report) {
        reports[year] = report;
        console.log(`✅ Generated report for ${year}: ${report.overview.totalPosts} posts, ${report.overview.totalWords} words`);
      }
    }

    // Save to file
    const output = {
      years,
      currentYear: new Date().getFullYear(),
      reports,
      generatedAt: new Date().toISOString(),
    };

    writeFileSync(REPORT_FILE, JSON.stringify(output, null, 2));
    console.log(`🎉 Annual report saved to: ${REPORT_FILE}`);

  } catch (error) {
    console.error("❌ Error generating annual report:", error);
    process.exit(1);
  }
}

main();
