---
title: Dataview Plugin Guide
description: Complete guide to using Obsidian Dataview plugin with examples and live demo
category: Obsidian Plugins
order: 11
version: 1.0.0
lastModified: 2025-12-09
hideCoverImage: false
hideTOC: false
draft: false
featured: true
---

Transform your Obsidian vault into a powerful queryable database with the Dataview plugin.

## What is Dataview?

**Dataview** is one of the most powerful Obsidian plugins that treats your vault as a database. It allows you to:

- 📊 Query your notes using SQL-like syntax
- 📈 Create dynamic views and reports
- 🔍 Filter and sort content automatically
- 📉 Generate statistics and visualizations
- ⚡ Update in real-time as your notes change

## Quick Start

### Installation

1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "Dataview"
4. Install and enable

### Your First Query

Create a new note and add this query:

```sql
TABLE date, mood
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 5
```

This displays your 5 most recent diary entries with their dates and moods.

## Query Types

Dataview supports four main query types:

### 1. TABLE Query

Display data in table format:

```sql
TABLE date as "Date", mood as "Mood", weather as "Weather"
FROM "diary"
WHERE !draft
SORT date DESC
```

**Use cases:**
- Diary entry overviews
- Task lists with metadata
- Content summaries

### 2. LIST Query

Simple list format:

```sql
LIST
FROM "posts"
WHERE contains(tags, "tech")
SORT date DESC
```

**Use cases:**
- File listings
- Tag-based content
- Quick overviews

### 3. TASK Query

Display tasks from your notes:

```sql
TASK
FROM "todo"
WHERE status != "done"
GROUP BY priority
```

**Use cases:**
- Task management
- Project tracking
- Todo lists

### 4. CALENDAR Query

Visualize content on a calendar:

```sql
CALENDAR date
FROM "diary"
```

**Use cases:**
- Activity tracking
- Content calendar
- Habit visualization

## Advanced Features

### DataviewJS

For complex queries, use JavaScript:

```javascript
const todos = dv.pages('"todo"').where(p => !p.draft);
const total = todos.length;
const completed = todos.where(p => p.status === "done").length;
const rate = Math.round((completed / total) * 100);

dv.paragraph(`**Completion Rate**: ${rate}% (${completed}/${total})`);
```

### Inline Queries

Embed queries inline within your text:

```
Today I have `= this.todos.length` tasks pending.
```

### Custom Functions

Use built-in functions for data manipulation:

- `length()` - Count items
- `contains()` - Check for values
- `date()` - Date operations
- `dur()` - Duration calculations

## Practical Examples

### Personal Dashboard

Create a comprehensive overview:

```sql
# 📊 My Dashboard

## Today's Tasks
```sql
TASK
FROM "todo"
WHERE dueDate = date(today) AND !draft
```

## Recent Diary Entries
```sql
TABLE date, mood, weather
FROM "diary"
WHERE !draft
SORT date DESC
LIMIT 5
```

## Project Progress
```javascript
const projects = dv.pages('"projects"').where(p => !p.draft);
const active = projects.where(p => p.status === "active").length;
const completed = projects.where(p => p.status === "done").length;

dv.paragraph(`Active: ${active} | Completed: ${completed}`);
```
```

### Weekly Review

Analyze your week's activity:

```javascript
const startOfWeek = dv.date("today").startOf("week");
const thisWeek = dv.pages('"diary"')
  .where(p => p.date >= startOfWeek && !p.draft);

dv.header(2, "This Week");
dv.list([
  `Diary entries: ${thisWeek.length}`,
  `Active days: ${new Set(thisWeek.map(p => p.date.day)).size}`,
  `Words written: ${thisWeek.map(p => p.file.size).reduce((a,b) => a+b, 0)}`
]);
```

### Tag Statistics

Analyze your content tags:

```javascript
const allPages = dv.pages().where(p => !p.draft);
const tagCounts = {};

allPages.forEach(page => {
  if (page.tags) {
    page.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

dv.table(["Tag", "Count"], sorted);
```

## Best Practices

### Performance Tips

1. **Use specific paths**: `FROM "diary"` instead of `FROM ""`
2. **Filter early**: Use `WHERE` before `SORT`
3. **Limit results**: Add `LIMIT` to large datasets
4. **Index frequently**: Keep frontmatter consistent

### Query Organization

1. **Comment your queries**: Explain complex logic
2. **Use variables**: Make DataviewJS readable
3. **Test incrementally**: Build queries step by step
4. **Create templates**: Reuse common patterns

### Common Patterns

**Date-based queries:**
```sql
WHERE date >= date(today) - dur(7 days)
```

**Multi-condition filters:**
```sql
WHERE (priority = "high" OR priority = "medium")
  AND status != "done"
  AND !draft
```

**Grouping and counting:**
```sql
TABLE WITHOUT ID
  category,
  length(rows) as "Count"
GROUP BY category
```

## Integration with Other Plugins

### Templater Integration

Use Templater to auto-insert Dataview queries:

```markdown
---
creation_date: <% tp.date.now("YYYY-MM-DD") %>
---

## Recent Activity
```sql
TABLE file.name, creation_date
FROM ""
WHERE creation_date >= date(today) - dur(7 days)
SORT creation_date DESC
```
```

### Calendar Integration

Visualize diary entries on calendar:

```sql
CALENDAR date
FROM "diary"
WHERE !draft
```

## Live Demo

Want to see Dataview in action? Check out our interactive presentation:

### 📊 Interactive Dataview Demo

<div style="border: 2px solid #42affa; border-radius: 8px; padding: 16px; margin: 24px 0; background: rgba(66, 175, 250, 0.05);">
  <h4 style="margin-top: 0;">🎬 Full Dataview Presentation</h4>
  <p>View our comprehensive Dataview presentation that covers:</p>
  <ul>
    <li>Basic query syntax and types</li>
    <li>Real-world diary and todo examples</li>
    <li>DataviewJS advanced features</li>
    <li>Best practices and optimization</li>
    <li>Live examples and demonstrations</li>
  </ul>
  <a href="/slides/dataview-demo" target="_blank" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #42affa 0%, #3498db 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 8px;">
    🎯 Open Dataview Demo Presentation →
  </a>
  <p style="margin-bottom: 0; margin-top: 12px; font-size: 0.9em; color: #666;">
    💡 Tip: Press <kbd>F</kbd> for fullscreen, <kbd>S</kbd> for speaker notes
  </p>
</div>

### Embed Live Demo

You can also view the presentation embedded below:

<div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 24px 0;">
  <iframe
    src="/slides/dataview-demo"
    width="100%"
    height="600px"
    frameborder="0"
    allow="fullscreen"
    style="display: block;"
  ></iframe>
</div>

## Troubleshooting

### Common Issues

**Query not showing results:**
- Check file paths in `FROM` clause
- Verify frontmatter fields exist
- Ensure `!draft` filter is appropriate

**Slow performance:**
- Reduce query scope
- Add more specific `WHERE` conditions
- Use `LIMIT` to restrict results

**Syntax errors:**
- Check for missing quotes
- Verify function names
- Test DataviewJS in console

## Resources

### Documentation
- [Dataview Official Docs](https://blacksmithgu.github.io/obsidian-dataview/)
- [Query Language Reference](https://blacksmithgu.github.io/obsidian-dataview/query/queries/)
- [DataviewJS API](https://blacksmithgu.github.io/obsidian-dataview/api/intro/)

### Examples in This Project
- `/docs/obsidian-integration-examples` - Complete examples
- `template/Dashboard.md` - Personal dashboard template
- `template/DATAVIEW-EXAMPLES.md` - Query examples collection

### Community Resources
- [Obsidian Forum](https://forum.obsidian.md/)
- [Discord Community](https://discord.gg/obsidianmd)
- [GitHub Examples](https://github.com/blacksmithgu/obsidian-dataview/discussions)

## Next Steps

1. **Install Dataview** in your Obsidian vault
2. **Try basic queries** from the examples above
3. **Watch the demo** presentation for visual learning
4. **Build your dashboard** using the template
5. **Experiment with DataviewJS** for advanced features

Start small, query often, and gradually build your data-driven note-taking system!

---

*Ready to make your notes work harder for you? Start querying with Dataview today!*
