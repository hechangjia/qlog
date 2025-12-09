import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { shouldShowPost } from "@/utils/markdown";

export const GET: APIRoute = async () => {
  try {
    // Get all diary entries and todo items
    const diaryEntries = await getCollection("diary");
    const todoItems = await getCollection("todo");

    // Filter visible entries based on environment
    const isDev = import.meta.env.DEV;
    const visibleDiaryEntries = diaryEntries.filter((entry: any) =>
      shouldShowPost(entry, isDev)
    );
    const visibleTodoItems = todoItems.filter((item: any) =>
      shouldShowPost(item, isDev)
    );

    // Calculate statistics
    const statistics = {
      // Diary statistics
      diary: {
        totalEntries: visibleDiaryEntries.length,
        byMood: calculateMoodStatistics(visibleDiaryEntries),
        byWeather: calculateWeatherStatistics(visibleDiaryEntries),
        byMonth: calculateMonthlyStatistics(visibleDiaryEntries),
        byYear: calculateYearlyStatistics(visibleDiaryEntries),
      },
      // Todo statistics
      todo: {
        totalItems: visibleTodoItems.length,
        byStatus: calculateTodoStatusStatistics(visibleTodoItems),
        byPriority: calculateTodoPriorityStatistics(visibleTodoItems),
        byCategory: calculateTodoCategoryStatistics(visibleTodoItems),
        byMonth: calculateTodoMonthlyStatistics(visibleTodoItems),
      },
      // Combined statistics
      combined: {
        totalEntries: visibleDiaryEntries.length + visibleTodoItems.length,
        recentActivity: calculateRecentActivity(visibleDiaryEntries, visibleTodoItems),
        productivity: calculateProductivity(visibleTodoItems),
      },
    };

    return new Response(JSON.stringify(statistics), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale for 24 hours
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch statistics" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

// Helper functions for calculating statistics

function calculateMoodStatistics(entries: any[]) {
  const moodCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const mood = entry.data.mood || "unknown";
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  return moodCounts;
}

function calculateWeatherStatistics(entries: any[]) {
  const weatherCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const weather = entry.data.weather || "unknown";
    weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
  });
  return weatherCounts;
}

function calculateMonthlyStatistics(entries: any[]) {
  const monthlyCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const date = new Date(entry.data.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
  });
  return monthlyCounts;
}

function calculateYearlyStatistics(entries: any[]) {
  const yearlyCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const date = new Date(entry.data.date);
    const year = date.getFullYear().toString();
    yearlyCounts[year] = (yearlyCounts[year] || 0) + 1;
  });
  return yearlyCounts;
}

function calculateTodoStatusStatistics(items: any[]) {
  const statusCounts: Record<string, number> = {};
  items.forEach(item => {
    const status = item.data.status || "todo";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  return statusCounts;
}

function calculateTodoPriorityStatistics(items: any[]) {
  const priorityCounts: Record<string, number> = {};
  items.forEach(item => {
    const priority = item.data.priority || "medium";
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });
  return priorityCounts;
}

function calculateTodoCategoryStatistics(items: any[]) {
  const categoryCounts: Record<string, number> = {};
  items.forEach(item => {
    const category = item.data.category || "uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  return categoryCounts;
}

function calculateTodoMonthlyStatistics(items: any[]) {
  const monthlyCounts: Record<string, number> = {};
  items.forEach(item => {
    const date = new Date(item.data.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
  });
  return monthlyCounts;
}

function calculateRecentActivity(diaryEntries: any[], todoItems: any[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentDiaryEntries = diaryEntries.filter(entry => 
    new Date(entry.data.date) > oneWeekAgo
  );
  
  const recentTodoItems = todoItems.filter(item => 
    new Date(item.data.date) > oneWeekAgo
  );
  
  const completedThisWeek = todoItems.filter(item => 
    item.data.status === "done" && new Date(item.data.date) > oneWeekAgo
  );
  
  return {
    diaryEntriesThisWeek: recentDiaryEntries.length,
    todoItemsThisWeek: recentTodoItems.length,
    completedThisWeek: completedThisWeek.length,
    diaryEntriesThisMonth: diaryEntries.filter(entry => 
      new Date(entry.data.date) > oneMonthAgo
    ).length,
    todoItemsThisMonth: todoItems.filter(item => 
      new Date(item.data.date) > oneMonthAgo
    ).length,
  };
}

function calculateProductivity(todoItems: any[]) {
  const totalItems = todoItems.length;
  const completedItems = todoItems.filter(item => item.data.status === "done").length;
  const inProgressItems = todoItems.filter(item => item.data.status === "in-progress").length;
  const todoItemsCount = todoItems.filter(item => item.data.status === "todo").length;
  
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  return {
    totalItems,
    completedItems,
    inProgressItems,
    todoItemsCount,
    completionRate: Math.round(completionRate * 100) / 100,
  };
}
