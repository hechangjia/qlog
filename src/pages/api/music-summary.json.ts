import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { calculateReadingTime } from '@/utils/markdown';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Get query parameters
    const period = url.searchParams.get('period') || 'week'; // week, month, 10n, year
    const n = parseInt(url.searchParams.get('n') || '1');

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '10n':
        startDate.setDate(now.getDate() - (10 * n));
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get diary entries, todos, and posts within date range
    const allDiaryEntries = await getCollection('diary');
    const allTodos = await getCollection('todo');
    const allPosts = await getCollection('posts');

    // Filter entries by date
    const filteredDiaryEntries = allDiaryEntries.filter(entry => {
      const entryDate = entry.data.date;
      return entryDate >= startDate && entryDate <= now;
    });

    const filteredTodos = allTodos.filter(todo => {
      const todoDate = todo.data.date;
      return todoDate >= startDate && todoDate <= now;
    });

    const filteredPosts = allPosts.filter(post => {
      const postDate = post.data.date;
      return postDate >= startDate && postDate <= now;
    });

    // Calculate statistics
    const totalDiaryEntries = filteredDiaryEntries.length;
    const totalTodos = filteredTodos.length;
    const totalPosts = filteredPosts.length;
    const completedTodos = filteredTodos.filter(todo => todo.data.status === 'done').length;

    // Calculate total words and reading time (including diary and posts)
    let totalWords = 0;
    let totalReadingTime = 0;

    filteredDiaryEntries.forEach(entry => {
      const readingTime = calculateReadingTime(entry.body || '');
      totalWords += readingTime.words;
      totalReadingTime += readingTime.minutes;
    });

    filteredPosts.forEach(post => {
      const readingTime = calculateReadingTime(post.body || '');
      totalWords += readingTime.words;
      totalReadingTime += readingTime.minutes;
    });

    // Extract moods from diary entries
    const moods = filteredDiaryEntries
      .map(entry => entry.data.mood)
      .filter(Boolean);

    const moodCounts: Record<string, number> = {};
    moods.forEach(mood => {
      if (mood) {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      }
    });

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0])[0];

    // Extract tags from diary, posts, and todos
    const allTags: string[] = [];

    // Tags from diary entries
    filteredDiaryEntries.forEach(entry => {
      if (entry.data.tags) {
        const tags = Array.isArray(entry.data.tags) ? entry.data.tags : [entry.data.tags];
        tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.push(tag);
          }
        });
      }
    });

    // Tags from posts
    filteredPosts.forEach(post => {
      if (post.data.tags) {
        const tags = Array.isArray(post.data.tags) ? post.data.tags : [post.data.tags];
        tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.push(tag);
          }
        });
      }
    });

    // Tags from todos
    filteredTodos.forEach(todo => {
      if (todo.data.tags) {
        const tags = Array.isArray(todo.data.tags) ? todo.data.tags : [todo.data.tags];
        tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.push(tag);
          }
        });
      }
    });

    const tagCounts: Record<string, number> = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // Create summary data structure
    const summaryData = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      statistics: {
        totalPosts,
        totalDiaryEntries,
        totalTodos,
        totalContent: totalPosts + totalDiaryEntries + totalTodos,
        completedTodos,
        completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
        totalWords,
        totalReadingTime,
        avgWordsPerEntry: (totalDiaryEntries + totalPosts) > 0 ? Math.round(totalWords / (totalDiaryEntries + totalPosts)) : 0,
      },
      moods: {
        dominantMood,
        moodDistribution: moodCounts,
      },
      tags: {
        topTags,
        tagDistribution: tagCounts,
      },
      // For deepseek API integration
      rawData: {
        posts: filteredPosts.map(post => ({
          title: post.data.title,
          date: post.data.date.toISOString(),
          tags: post.data.tags,
          excerpt: post.data.description,
        })),
        diaryEntries: filteredDiaryEntries.map(entry => ({
          title: entry.data.title,
          date: entry.data.date.toISOString(),
          mood: entry.data.mood,
          tags: entry.data.tags,
          excerpt: entry.data.description,
        })),
        todos: filteredTodos.map(todo => ({
          title: todo.data.title,
          date: todo.data.date.toISOString(),
          status: todo.data.status,
          priority: todo.data.priority,
          dueDate: todo.data.dueDate?.toISOString(),
        })),
      },
    };

    return new Response(JSON.stringify(summaryData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });

  } catch (error) {
    console.error('Error generating music summary:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate music summary',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
