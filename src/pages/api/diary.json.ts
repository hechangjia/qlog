import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { shouldShowPost } from "@/utils/markdown";

export const GET: APIRoute = async () => {
  try {
    // Get all diary entries
    const diaryEntries = await getCollection("diary");

    // Filter visible entries based on environment
    const isDev = import.meta.env.DEV;
    const visibleEntries = diaryEntries.filter((entry: any) =>
      shouldShowPost(entry, isDev)
    );

    // Map to command palette format
    const commandPaletteData = visibleEntries.map((entry: any) => ({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      url: `/diary/${entry.id}`,
      type: "diary" as const,
      date: entry.data.date,
      mood: entry.data.mood,
      weather: entry.data.weather,
      location: entry.data.location,
      tags: entry.data.tags || [],
    }));

    // Sort by date (newest first)
    commandPaletteData.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return new Response(JSON.stringify(commandPaletteData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale for 24 hours
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch diary entries" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
