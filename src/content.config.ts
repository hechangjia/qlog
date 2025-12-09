import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define schema for blog posts
const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().default('Untitled Post'),
    description: z.string().nullable().optional().default('No description provided'),
    date: z.coerce.date().default(() => new Date()),
    tags: z.array(z.string()).nullable().optional(),
    draft: z.boolean().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageOG: z.boolean().optional(),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    targetKeyword: z.string().nullable().optional(),
    author: z.string().nullable().optional(),
    noIndex: z.boolean().optional(),
  }),
});

// Define schema for static pages
const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().default('Untitled Page'),
    description: z.string().nullable().optional().default('No description provided'),
    draft: z.boolean().optional(),
    lastModified: z.coerce.date().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    noIndex: z.boolean().optional(),
  }),
});

// Define schema for projects
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().default('Untitled Project'),
    description: z.string().nullable().optional().default('No description provided'),
    date: z.coerce.date().default(() => new Date()),
    categories: z.array(z.string()).nullable().optional().default([]),
    repositoryUrl: z.string().url().nullable().optional(),
    projectUrl: z.string().url().nullable().optional(),
    status: z.string().nullable().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    draft: z.boolean().optional(),
    noIndex: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

// Define schema for docs
const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string().default('Untitled Documentation'),
    description: z.string().nullable().optional().default('No description provided'),
    category: z.string().nullable().optional().default('General'),
    order: z.number().default(0),
    lastModified: z.coerce.date().optional(),
    version: z.string().nullable().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    draft: z.boolean().optional(),
    noIndex: z.boolean().optional(),
    showTOC: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

// Define schema for special home pages (homepage blurb, 404, projects index, docs index)
const specialCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/special' }),
  schema: z.object({
    title: z.string().default('Untitled Page'),
    description: z.string().nullable().optional().default('No description provided'),
    hideTOC: z.boolean().optional(),
    // These pages have fixed URLs and special logic
    // URLs are determined by the file location, not frontmatter
  }),
});

// Define schema for diary entries
const diaryCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/diary' }),
  schema: z.object({
    title: z.string().default('Untitled Diary Entry'),
    description: z.string().nullable().optional().default('No description provided'),
    date: z.coerce.date().default(() => new Date()),
    mood: z.enum(['happy', 'sad', 'neutral', 'excited', 'tired', 'stressed', 'peaceful']).nullable().optional(),
    weather: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    draft: z.boolean().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    noIndex: z.boolean().optional(),
  }),
});

// Define schema for todo items
const todoCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/todo' }),
  schema: z.object({
    title: z.string().default('Untitled Todo'),
    description: z.string().nullable().optional().default('No description provided'),
    date: z.coerce.date().default(() => new Date()),
    dueDate: z.coerce.date().nullable().optional(),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    category: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    draft: z.boolean().optional(),
    hideTOC: z.boolean().optional(),
    noIndex: z.boolean().optional(),
    image: z.any().nullable().optional().transform((val) => {
      // Handle various Obsidian syntax formats
      if (Array.isArray(val)) {
        // Handle array format from [[...]] syntax - take first element
        return val[0] || null;
      }
      if (typeof val === 'string') {
        // Handle string format - return as-is
        return val;
      }
      return null;
    }),
    imageAlt: z.string().nullable().optional(),
    hideCoverImage: z.boolean().optional(),
    estimatedTime: z.string().nullable().optional(),
    dependencies: z.array(z.string()).nullable().optional(),
    assignedTo: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    progress: z.number().min(0).max(100).nullable().optional(),
  }),
});

// Define schema for slides (presentations)
const slidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/slides' }),
  schema: z.object({
    // Basic metadata
    title: z.string().default('Untitled Presentation'),
    description: z.string().nullable().optional().default('No description provided'),
    date: z.coerce.date().default(() => new Date()),
    author: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    draft: z.boolean().optional(),
    noIndex: z.boolean().optional(),

    // Display settings
    width: z.number().optional(),
    height: z.number().optional(),
    margin: z.number().optional(),
    minScale: z.number().optional(),
    maxScale: z.number().optional(),

    // Appearance
    theme: z.enum(['black', 'white', 'league', 'beige', 'sky', 'night', 'serif', 'simple', 'solarized', 'blood', 'moon']).default('black'),
    transition: z.enum(['none', 'fade', 'slide', 'convex', 'concave', 'zoom']).default('slide'),
    transitionSpeed: z.enum(['default', 'fast', 'slow']).optional(),
    backgroundTransition: z.enum(['none', 'fade', 'slide', 'convex', 'concave', 'zoom']).default('fade'),

    // Behavior
    controls: z.boolean().default(true),
    controlsTutorial: z.boolean().optional(),
    controlsLayout: z.enum(['bottom-right', 'edges']).optional(),
    controlsBackArrows: z.enum(['faded', 'hidden', 'visible']).optional(),
    progress: z.boolean().default(true),
    slideNumber: z.boolean().default(true),
    showSlideNumber: z.enum(['all', 'print', 'speaker']).optional(),
    hashOneBasedIndex: z.boolean().optional(),
    center: z.boolean().default(true),
    loop: z.boolean().default(false),
    rtl: z.boolean().default(false),
    navigationMode: z.enum(['default', 'linear', 'grid']).optional(),
    shuffle: z.boolean().optional(),

    // Auto-slide
    autoSlide: z.number().default(0),
    autoSlideStoppable: z.boolean().optional(),

    // Mouse
    mouseWheel: z.boolean().default(false),

    // Media
    previewLinks: z.boolean().default(false),
    hideAddressBar: z.boolean().default(true),
  }),
});

// Export collections
export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  projects: projectsCollection,
  docs: docsCollection,
  special: specialCollection,
  diary: diaryCollection,
  todo: todoCollection,
  slides: slidesCollection,
};
