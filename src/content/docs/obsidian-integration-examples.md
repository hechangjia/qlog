---
title: Obsidian Integration Examples
description: Comprehensive examples of Dataview, Templater, and Advanced Slides integration with your blog
category: Obsidian Plugins
order: 10
version: 1.0.0
lastModified: 2025-12-09
hideCoverImage: false
hideTOC: false
draft: false
featured: true
---

This guide provides comprehensive examples of how to use Obsidian plugins (Dataview, Templater, and Advanced Slides) with your Astro blog system.

## Overview

This integration allows you to:
- **Dataview**: Query and analyze your content (diary, todos, posts, slides)
- **Templater**: Auto-generate content with dynamic templates
- **Advanced Slides**: Create beautiful reveal.js presentations

## 1. Dataview Examples

Dataview transforms your Obsidian vault into a queryable database. Here are practical examples for each content type.

### 1.1 Diary Queries

#### Recent Diary Entries

```sql
TABLE date as "Date", mood as "Mood", weather as "Weather"
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 10
```

This displays your 10 most recent diary entries with date, mood, and weather.

#### Mood Analysis

```sql
TABLE WITHOUT ID
  mood as "Mood",
  length(rows) as "Count"
FROM "diary"
WHERE !draft
GROUP BY mood
SORT length(rows) DESC
```

Shows distribution of your moods across all diary entries.

#### Diary by Location

```sql
TABLE date, mood, weather
FROM "diary"
WHERE location = "Home" AND !draft
SORT date DESC
```

Find all diary entries written at a specific location.

#### Monthly Statistics (DataviewJS)

```sqljs
const diaries = dv.pages('"diary"').where(p => !p.draft);
const thisMonth = diaries.where(p =>
  p.date.month === dv.date("today").month &&
  p.date.year === dv.date("today").year
);

dv.paragraph(`📊 **This Month's Statistics:**`);
dv.list([
  `Total entries: ${thisMonth.length}`,
  `Days active: ${new Set(thisMonth.map(p => p.date.day)).size}`,
  `Most common mood: ${thisMonth.mood[0] || "N/A"}`
]);
```

### 1.2 Todo Queries

#### Active Tasks by Priority

```sql
TASK
FROM "todo"
WHERE status != "done" AND !draft
GROUP BY priority
SORT priority DESC
```

Shows all incomplete tasks grouped by priority level.

#### Overdue Tasks

```sql
TABLE dueDate as "Due", priority as "Priority", category as "Category"
FROM "todo"
WHERE dueDate < date(today) AND status != "done" AND !draft
SORT dueDate ASC
```

Lists all overdue tasks that haven't been completed yet.

#### Completion Rate (DataviewJS)

```sqljs
const todos = dv.pages('"todo"').where(p => !p.draft);
const total = todos.length;
const completed = todos.where(p => p.status === "done").length;
const rate = Math.round((completed / total) * 100);

dv.paragraph(`📈 **Overall Completion Rate: ${rate}%**`);
dv.paragraph(`✅ Completed: ${completed} / ${total}`);
```

#### Tasks by Category

```sql
TABLE WITHOUT ID
  category as "Category",
  length(rows.where(r => r.status = "done")) as "Done",
  length(rows.where(r => r.status != "done")) as "Active",
  length(rows) as "Total"
FROM "todo"
WHERE !draft
GROUP BY category
SORT length(rows) DESC
```

### 1.3 Slides Queries

#### All Presentations

```sql
TABLE date as "Date", author as "Author", theme as "Theme"
FROM "slides"
WHERE !draft
SORT date DESC
```

#### Slides by Theme

```sql
LIST
FROM "slides"
WHERE theme = "night" AND !draft
SORT date DESC
```

#### Tag Analysis

```sqljs
const slides = dv.pages('"slides"').where(p => !p.draft);
const tagCounts = {};

slides.forEach(slide => {
  if (slide.tags) {
    slide.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

dv.paragraph(`📊 **Top 10 Slide Tags:**`);
dv.table(
  ["Tag", "Count"],
  sorted.map(([tag, count]) => [tag, count])
);
```

### 1.4 Cross-Content Queries

#### Weekly Overview

```sqljs
const startOfWeek = dv.date("today").startOf("week");
const endOfWeek = dv.date("today").endOf("week");

const diaries = dv.pages('"diary"')
  .where(p => !p.draft && p.date >= startOfWeek && p.date <= endOfWeek);
const todos = dv.pages('"todo"')
  .where(p => !p.draft && p.date >= startOfWeek && p.date <= endOfWeek);
const slides = dv.pages('"slides"')
  .where(p => !p.draft && p.date >= startOfWeek && p.date <= endOfWeek);

dv.header(2, "📅 This Week's Activity");
dv.list([
  `📝 ${diaries.length} diary entries`,
  `✅ ${todos.length} new todos`,
  `📊 ${slides.length} presentations created`
]);
```

#### Content by Tag

```sql
TABLE file.folder as "Type", date as "Date", title as "Title"
FROM "diary" OR "todo" OR "posts" OR "slides"
WHERE contains(tags, "personal") AND !draft
SORT date DESC
LIMIT 20
```

## 2. Templater Examples

Templater allows you to create dynamic templates with variables, date functions, and cursor positions.

### 2.1 Diary Template

Location: `src/content/template/diary/templater-template.md`

```markdown
---
title: "<% tp.date.now("YYYY-MM-DD") %> Diary"
description: "<% tp.file.cursor(1) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
mood: happy
weather: "☀️"
location: ""
tags: []
draft: false
---

# <% tp.date.now("YYYY年MM月DD日") %> - <% tp.date.now("dddd", "YYYY-MM-DD", "zh-cn") %>

> 💭 Today's mood: <% tp.file.cursor(2) %>

## 🌅 Morning

<% tp.file.cursor(3) %>

## 🌆 Afternoon

<% tp.file.cursor(4) %>

## 🌃 Evening

<% tp.file.cursor(5) %>

## 📝 Summary

<% tp.file.cursor(6) %>

## 🎯 Tomorrow's Goals

- <% tp.file.cursor(7) %>
```

**How it works:**
- `tp.date.now()` - Inserts current date in specified format
- `tp.file.cursor(n)` - Tab stop positions for quick navigation
- Auto-applies when creating files in `diary/` folder

### 2.2 Todo Template

Location: `src/content/template/todo/templater-template.md`

```markdown
---
title: "<% tp.file.cursor(1) %>"
description: "<% tp.file.cursor(2) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
dueDate: <% tp.date.now("YYYY-MM-DD", 7) %>
priority: medium
status: todo
category: <% tp.file.cursor(3) %>
tags: []
draft: false
---

## 📋 Task Description

<% tp.file.cursor(4) %>

## ✅ Checklist

- [ ] <% tp.file.cursor(5) %>
- [ ]
- [ ]

## 📝 Notes

<% tp.file.cursor(6) %>

## 🔗 Related

<% tp.file.cursor(7) %>
```

**Features:**
- `tp.date.now("YYYY-MM-DD", 7)` - Sets due date 7 days from now
- Multiple cursor positions for efficient data entry
- Auto-applies in `todo/` folder

### 2.3 Slides Template

Location: `src/content/template/slides/templater-template.md`

```markdown
---
title: "<% tp.file.cursor(1) %>"
description: "<% tp.file.cursor(2) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
author: "<% tp.file.cursor(3) %>"
tags: [<% tp.file.cursor(4) %>]
theme: "night"
transition: "slide"
controls: true
progress: true
slideNumber: true
draft: false
---

<!-- Title Slide -->
<section class="center">

# <% tp.file.cursor(5) %>

## <% tp.file.cursor(6) %>

</section>

---

<!-- Content Slide -->
<section>

## <% tp.file.cursor(7) %>

<div class="fragment">

<% tp.file.cursor(8) %>

</div>

</section>

---

<!-- Thank You -->
<section class="center">

# Thank You!

<% tp.file.cursor(9) %>

</section>
```

### 2.4 Custom Template Functions

**Current Week Number:**
```javascript
<% tp.date.now("ww") %>
```

**Relative Dates:**
```javascript
Yesterday: <% tp.date.now("YYYY-MM-DD", -1) %>
Tomorrow: <% tp.date.now("YYYY-MM-DD", 1) %>
Next Week: <% tp.date.now("YYYY-MM-DD", 7) %>
```

**Conditional Logic:**
```javascript
<% tp.date.now("dddd") === "Monday" ? "Week Start!" : "Regular Day" %>
```

## 3. Advanced Slides Examples

Advanced Slides uses reveal.js to create interactive presentations from markdown.

### 3.1 Basic Slide Structure

```markdown
---
title: "My Presentation"
theme: "night"
transition: "slide"
---

<!-- Horizontal slide -->
<section>

# Title Slide

Your content here

</section>

---

<!-- Another horizontal slide -->
<section>

## Content Slide

More content

</section>
```

### 3.2 Vertical Slides

```markdown
<section>

<!-- Parent slide -->
<section>

# Section Title

</section>

<!-- Child slide (navigate down) -->
<section>

## Detail 1

Content

</section>

<!-- Another child slide -->
<section>

## Detail 2

More content

</section>

</section>
```

### 3.3 Fragments (Progressive Reveal)

```markdown
<section>

## Progressive Content

<div class="fragment">
First point appears
</div>

<div class="fragment">
Then second point
</div>

<div class="fragment">
Finally third point
</div>

</section>
```

### 3.4 Two-Column Layout

```markdown
<section>

## Comparison

<div class="two-columns">

<div>

**Pros:**
- Easy to use
- Fast
- Flexible

</div>

<div>

**Cons:**
- Learning curve
- Requires setup
- Needs practice

</div>

</div>

</section>
```

### 3.5 Code Blocks

```markdown
<section>

## Code Example

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```​

</section>
```

### 3.6 Speaker Notes

```markdown
<section>

## Public Content

This is what the audience sees.

<aside class="notes">
  These are private notes only visible in speaker view.
  Press 'S' to open speaker notes.
</aside>

</section>
```

### 3.7 Styled Boxes

```markdown
<section>

## Styled Content

<div class="highlight-box">
💡 This is highlighted information
</div>

<div class="warning-box">
⚠️ This is a warning
</div>

<div class="success-box">
✅ This is success information
</div>

<div class="error-box">
❌ This is an error message
</div>

</section>
```

## 4. Complete Workflow Example

### Scenario: Weekly Planning

#### Step 1: Create Weekly Plan (Templater)

In Obsidian, create `2024-12-09-weekly-plan.md` in `todo/` folder:

```markdown
---
title: "Week 50 Planning - Dec 9-15"
date: 2024-12-09
dueDate: 2024-12-15
priority: high
status: in-progress
category: planning
---

## 🎯 Week Goals

- Complete blog post
- Finish presentation
- Review code

## 📋 Tasks

- [ ] Write draft
- [ ] Create slides
- [ ] Code review
```

#### Step 2: Track Progress (Dataview)

Create `dashboard.md` to monitor progress:

```sqljs
// This week's todos
const thisWeek = dv.pages('"todo"')
  .where(p => p.date >= dv.date("today").startOf("week"))
  .where(p => !p.draft);

// Statistics
const total = thisWeek.length;
const done = thisWeek.where(p => p.status === "done").length;
const inProgress = thisWeek.where(p => p.status === "in-progress").length;

dv.header(2, "📊 This Week's Progress");
dv.paragraph(`**Completion:** ${Math.round(done/total*100)}%`);
dv.list([
  `✅ Done: ${done}`,
  `🔄 In Progress: ${inProgress}`,
  `📝 Todo: ${total - done - inProgress}`
]);
```

#### Step 3: Create Presentation (Advanced Slides)

When ready to present results, create slides:

```markdown
---
title: "Week 50 Review"
theme: "night"
---

<section class="center">

# Week 50 Review
## Dec 9-15, 2024

</section>

---

<section>

## 🎯 Goals Achieved

<div class="fragment">✅ Blog post published</div>
<div class="fragment">✅ Presentation completed</div>
<div class="fragment">✅ Code reviewed</div>

</section>

---

<section>

## 📈 Statistics

<div class="two-columns">

<div>

**Completed:**
- 12 tasks done
- 3 blog posts
- 1 presentation

</div>

<div>

**Next Week:**
- New project
- Team meeting
- Documentation

</div>

</div>

</section>
```

## 5. Dashboard Template

Create `template/Dashboard.md` for a comprehensive overview:

```markdown
# 🎯 Personal Dashboard

> Last updated: <% tp.date.now("YYYY-MM-DD HH:mm") %>

## 📅 Today's Overview

### Today's Diary
```sql
LIST
FROM "diary"
WHERE date = date(today) AND !draft
```

### Today's Tasks
```sql
TASK
FROM "todo"
WHERE date = date(today) OR dueDate = date(today)
WHERE !draft
```

## 📊 Statistics

### This Week
```sqljs
const week = dv.date("today").startOf("week");
const diaries = dv.pages('"diary"').where(p => p.date >= week && !p.draft);
const todos = dv.pages('"todo"').where(p => p.date >= week && !p.draft);
const slides = dv.pages('"slides"').where(p => p.date >= week && !p.draft);

dv.paragraph(`📝 ${diaries.length} diary entries`);
dv.paragraph(`✅ ${todos.length} todos created`);
dv.paragraph(`📊 ${slides.length} presentations`);
```

### Completion Rate
```sqljs
const todos = dv.pages('"todo"').where(p => !p.draft);
const done = todos.where(p => p.status === "done").length;
const total = todos.length;
const rate = Math.round(done / total * 100);

dv.paragraph(`**${rate}%** completion rate (${done}/${total})`);
```

## 📝 Recent Content

### Recent Diary Entries (Last 5)
```sql
TABLE date, mood, weather
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 5
```

### Active Tasks (High Priority)
```sql
TABLE dueDate, priority, category
FROM "todo"
WHERE status != "done" AND priority = "high" AND !draft
SORT dueDate ASC
```

### Recent Presentations
```sql
TABLE date, theme, length(tags) as "Tags"
FROM "slides"
WHERE !draft
SORT date DESC
LIMIT 5
```

## 🏷️ Tag Cloud

```sqljs
const allContent = [
  ...dv.pages('"diary"').where(p => !p.draft),
  ...dv.pages('"todo"').where(p => !p.draft),
  ...dv.pages('"posts"').where(p => !p.draft),
  ...dv.pages('"slides"').where(p => !p.draft)
];

const tagCounts = {};
allContent.forEach(item => {
  if (item.tags) {
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

dv.table(
  ["Tag", "Count"],
  sorted.map(([tag, count]) => [tag, count])
);
```

## ⚠️ Overdue Tasks

```sql
TABLE dueDate as "Due Date", priority, category
FROM "todo"
WHERE dueDate < date(today) AND status != "done" AND !draft
SORT dueDate ASC
```

---

*Dashboard auto-updates with live data from your content*
```

## 6. Tips and Best Practices

### Dataview Best Practices

1. **Use `!draft` filter** - Always exclude draft content in production queries
2. **Sort results** - Always add `SORT` for consistent ordering
3. **Limit results** - Use `LIMIT` for large datasets
4. **Group data** - Use `GROUP BY` for summaries
5. **Cache awareness** - Dataview queries update in real-time

### Templater Best Practices

1. **Number cursor positions** - Use sequential numbers for logical flow
2. **Default values** - Provide sensible defaults in frontmatter
3. **Date formats** - Use consistent date formats across templates
4. **Folder templates** - Set up auto-apply for different folders
5. **Test templates** - Always test new templates before deployment

### Advanced Slides Best Practices

1. **Keep slides simple** - One main point per slide
2. **Use fragments** - Progressive reveal for complex content
3. **Consistent theme** - Stick to one theme per presentation
4. **Speaker notes** - Add notes for all important slides
5. **Test navigation** - Check both horizontal and vertical navigation

### Integration Best Practices

1. **Consistent naming** - Use clear, consistent file names
2. **Proper tagging** - Tag content appropriately for cross-references
3. **Regular reviews** - Review and update dashboard regularly
4. **Backup content** - Keep git backups of all Obsidian content
5. **Documentation** - Document custom queries and templates

## 7. Troubleshooting

### Dataview Not Showing Results

- Check if Dataview plugin is enabled
- Verify folder paths in queries
- Ensure content has proper frontmatter
- Check for syntax errors in queries

### Templater Not Working

- Verify Templater plugin is enabled
- Check templates folder path in settings
- Ensure trigger on file creation is enabled
- Verify folder templates are configured correctly

### Slides Not Rendering

- Check frontmatter configuration
- Verify theme name is valid
- Ensure proper section structure
- Check for unclosed HTML tags

## 8. Resources

### Documentation

- [Dataview Documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [Templater Documentation](https://silentvoid13.github.io/Templater/)
- [Reveal.js Documentation](https://revealjs.com/)
- [Advanced Slides Guide](https://github.com/MSzturc/obsidian-advanced-slides)

### Example Files

In your vault:
- `template/Dashboard.md` - Personal dashboard
- `template/DATAVIEW-EXAMPLES.md` - Query examples
- `slides/obsidian-integration.md` - Demo presentation

### Quick Links

- View all slides: `/slides`
- View diary entries: `/diary`
- View todos: `/todo`
- API documentation: `/docs/api`

---

This comprehensive guide should help you make the most of your Obsidian integration! Experiment with these examples and adapt them to your workflow.
