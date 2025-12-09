// Dataview query executor for web
import type { CollectionEntry } from 'astro:content';

export type DataviewQueryType = 'TABLE' | 'LIST' | 'TASK' | 'CALENDAR';

export interface DataviewQuery {
  type: DataviewQueryType;
  fields?: string[];
  from: string;
  where?: string;
  sort?: { field: string; direction: 'ASC' | 'DESC' }[];
  limit?: number;
  groupBy?: string;
}

// Parse a simple Dataview query
export function parseDataviewQuery(query: string): DataviewQuery {
  const lines = query.trim().split('\n').map(line => line.trim());

  // Determine query type
  const firstLine = lines[0].toUpperCase();
  let type: DataviewQueryType = 'LIST';
  let fields: string[] = [];

  if (firstLine.startsWith('TABLE')) {
    type = 'TABLE';
    const fieldsMatch = firstLine.match(/^TABLE\s+(.+)/i);
    if (fieldsMatch) {
      fields = fieldsMatch[1].split(',').map(f => f.trim());
    }
  } else if (firstLine.startsWith('LIST')) {
    type = 'LIST';
  } else if (firstLine.startsWith('TASK')) {
    type = 'TASK';
  }

  // Parse FROM clause
  let from = '';
  const fromLine = lines.find(line => line.toUpperCase().startsWith('FROM'));
  if (fromLine) {
    const fromMatch = fromLine.match(/FROM\s+"?([^"]+)"?/i);
    if (fromMatch) {
      from = fromMatch[1];
    }
  }

  // Parse WHERE clause
  let where = '';
  const whereLine = lines.find(line => line.toUpperCase().startsWith('WHERE'));
  if (whereLine) {
    const whereMatch = whereLine.match(/WHERE\s+(.+)/i);
    if (whereMatch) {
      where = whereMatch[1];
    }
  }

  // Parse SORT clause
  let sort: { field: string; direction: 'ASC' | 'DESC' }[] = [];
  const sortLine = lines.find(line => line.toUpperCase().startsWith('SORT'));
  if (sortLine) {
    const sortMatch = sortLine.match(/SORT\s+(.+)/i);
    if (sortMatch) {
      const sortParts = sortMatch[1].split(',').map(s => s.trim());
      sort = sortParts.map(part => {
        const [field, dir] = part.split(/\s+/);
        return {
          field: field.trim(),
          direction: (dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC'
        };
      });
    }
  }

  // Parse LIMIT clause
  let limit: number | undefined;
  const limitLine = lines.find(line => line.toUpperCase().startsWith('LIMIT'));
  if (limitLine) {
    const limitMatch = limitLine.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      limit = parseInt(limitMatch[1]);
    }
  }

  // Parse GROUP BY clause
  let groupBy: string | undefined;
  const groupByLine = lines.find(line => line.toUpperCase().includes('GROUP BY'));
  if (groupByLine) {
    const groupMatch = groupByLine.match(/GROUP BY\s+(\w+)/i);
    if (groupMatch) {
      groupBy = groupMatch[1];
    }
  }

  return { type, fields, from, where, sort, limit, groupBy };
}

// Execute WHERE clause
function evaluateWhere(item: any, whereClause: string): boolean {
  if (!whereClause) return true;

  // Handle AND conditions first (before checking individual conditions)
  if (whereClause.includes(' AND ')) {
    const conditions = whereClause.split(' AND ').map(c => c.trim());
    const result = conditions.every(condition => evaluateWhere(item, condition));
    console.log(`[Dataview WHERE] AND condition: ${whereClause} => ${result}`, { conditions });
    return result;
  }

  // Handle OR conditions
  if (whereClause.includes(' OR ')) {
    const conditions = whereClause.split(' OR ').map(c => c.trim());
    const result = conditions.some(condition => evaluateWhere(item, condition));
    console.log(`[Dataview WHERE] OR condition: ${whereClause} => ${result}`, { conditions });
    return result;
  }

  // Simple condition evaluation
  // Support: field = "value", field != "value", field > value, field < value

  // Handle status conditions
  if (whereClause.includes('status')) {
    if (whereClause.includes('!= "done"') || whereClause.includes("!= 'done'") || whereClause.includes('!= done')) {
      const result = item.data.status !== 'done';
      console.log(`[Dataview WHERE] status != "done": ${item.data.status} !== 'done' => ${result}`);
      return result;
    }
    if (whereClause.includes('= "done"') || whereClause.includes("= 'done'") || whereClause.includes('= done')) {
      const result = item.data.status === 'done';
      console.log(`[Dataview WHERE] status = "done": ${item.data.status} === 'done' => ${result}`);
      return result;
    }
    if (whereClause.includes('= "todo"') || whereClause.includes("= 'todo'") || whereClause.includes('= todo')) {
      const result = item.data.status === 'todo';
      console.log(`[Dataview WHERE] status = "todo": ${item.data.status} === 'todo' => ${result}`);
      return result;
    }
    if (whereClause.includes('= "in-progress"') || whereClause.includes("= 'in-progress'") || whereClause.includes('= in-progress')) {
      const result = item.data.status === 'in-progress';
      console.log(`[Dataview WHERE] status = "in-progress": ${item.data.status} === 'in-progress' => ${result}`);
      return result;
    }
  }

  // Handle priority conditions
  if (whereClause.includes('priority')) {
    if (whereClause.includes('= "high"') || whereClause.includes("= 'high'") || whereClause.includes('= high')) {
      const result = item.data.priority === 'high';
      console.log(`[Dataview WHERE] priority = "high": ${item.data.priority} === 'high' => ${result}`);
      return result;
    }
    if (whereClause.includes('= "medium"') || whereClause.includes("= 'medium'") || whereClause.includes('= medium')) {
      const result = item.data.priority === 'medium';
      console.log(`[Dataview WHERE] priority = "medium": ${item.data.priority} === 'medium' => ${result}`);
      return result;
    }
    if (whereClause.includes('= "low"') || whereClause.includes("= 'low'") || whereClause.includes('= low')) {
      const result = item.data.priority === 'low';
      console.log(`[Dataview WHERE] priority = "low": ${item.data.priority} === 'low' => ${result}`);
      return result;
    }
  }

  // Handle date comparisons
  if (whereClause.includes('dueDate') && whereClause.includes('date(today)')) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!item.data.dueDate) {
      console.log(`[Dataview WHERE] dueDate comparison: no dueDate => false`);
      return false;
    }

    const dueDate = new Date(item.data.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (whereClause.includes('< date(today)')) {
      const result = dueDate < today;
      console.log(`[Dataview WHERE] dueDate < today: ${dueDate} < ${today} => ${result}`);
      return result;
    }
    if (whereClause.includes('> date(today)')) {
      const result = dueDate > today;
      console.log(`[Dataview WHERE] dueDate > today: ${dueDate} > ${today} => ${result}`);
      return result;
    }
    if (whereClause.includes('= date(today)')) {
      const result = dueDate.getTime() === today.getTime();
      console.log(`[Dataview WHERE] dueDate = today: ${dueDate} === ${today} => ${result}`);
      return result;
    }
    if (whereClause.includes('<= date(today)')) {
      const result = dueDate <= today;
      console.log(`[Dataview WHERE] dueDate <= today: ${dueDate} <= ${today} => ${result}`);
      return result;
    }
    if (whereClause.includes('>= date(today)')) {
      const result = dueDate >= today;
      console.log(`[Dataview WHERE] dueDate >= today: ${dueDate} >= ${today} => ${result}`);
      return result;
    }
  }

  // Handle date >= date(today) - dur(7 days)
  if (whereClause.includes('date >= date(today) - dur(7 days)')) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const itemDate = new Date(item.data.date);
    itemDate.setHours(0, 0, 0, 0);

    const result = itemDate >= weekAgo;
    console.log(`[Dataview WHERE] date >= week ago: ${itemDate} >= ${weekAgo} => ${result}`);
    return result;
  }

  // Handle mood field existence
  if (whereClause.trim() === 'mood') {
    const result = item.data.mood !== undefined && item.data.mood !== null;
    console.log(`[Dataview WHERE] mood exists: ${result}`);
    return result;
  }

  // Handle category field existence
  if (whereClause.trim() === 'category') {
    const result = item.data.category !== undefined && item.data.category !== null;
    console.log(`[Dataview WHERE] category exists: ${result}`);
    return result;
  }

  console.log(`[Dataview WHERE] No matching condition for: ${whereClause}, returning true`);
  return true;
}

// Execute SORT clause
function executeSort(items: any[], sortClauses: { field: string; direction: 'ASC' | 'DESC' }[]): any[] {
  if (!sortClauses || sortClauses.length === 0) return items;

  return [...items].sort((a, b) => {
    for (const { field, direction } of sortClauses) {
      let aVal = a.data[field];
      let bVal = b.data[field];

      // Handle date fields
      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      // Handle null/undefined
      if (aVal == null && bVal == null) continue;
      if (aVal == null) return direction === 'ASC' ? 1 : -1;
      if (bVal == null) return direction === 'ASC' ? -1 : 1;

      // Compare values
      if (aVal < bVal) return direction === 'ASC' ? -1 : 1;
      if (aVal > bVal) return direction === 'ASC' ? 1 : -1;
    }
    return 0;
  });
}

// Extract tasks from markdown body
export function extractTasksFromMarkdown(body: string, sourceFile: any): any[] {
  const tasks: any[] = [];
  const lines = body.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match checkbox tasks: - [ ] or - [x] or - [X]
    const taskMatch = line.match(/^(\s*)- \[([ xX])\]\s+(.+)$/);

    if (taskMatch) {
      const [, indent, checkMark, taskText] = taskMatch;
      const isCompleted = checkMark.toLowerCase() === 'x';

      tasks.push({
        text: taskText.trim(),
        completed: isCompleted,
        line: i + 1,
        indent: indent.length,
        sourceFile: sourceFile.id,
        sourceData: sourceFile.data
      });
    }
  }

  return tasks;
}

// Execute a Dataview query
export async function executeDataviewQuery(
  query: string,
  collections: Record<string, CollectionEntry<any>[]>
): Promise<any> {
  const parsed = parseDataviewQuery(query);
  console.log('[Dataview] Parsed query:', parsed);

  // Get the data source
  let items: any[] = [];
  if (parsed.from === 'diary') {
    items = collections.diary || [];
  } else if (parsed.from === 'todo') {
    items = collections.todo || [];
  } else if (parsed.from === 'posts') {
    items = collections.posts || [];
  } else if (parsed.from === 'docs') {
    items = collections.docs || [];
  } else if (parsed.from === 'projects') {
    items = collections.projects || [];
  }

  console.log(`[Dataview] Found ${items.length} items from collection "${parsed.from}"`);

  // Filter by WHERE clause
  if (parsed.where) {
    console.log('[Dataview] Applying WHERE clause:', parsed.where);
    items = items.filter(item => {
      const result = evaluateWhere(item, parsed.where!);
      console.log(`[Dataview] Item "${item.data.title}" - priority: ${item.data.priority}, status: ${item.data.status}, match: ${result}`);
      return result;
    });
    console.log(`[Dataview] After WHERE: ${items.length} items`);
  }

  // For TASK queries, extract tasks from markdown body
  if (parsed.type === 'TASK') {
    console.log('[Dataview] TASK query - extracting tasks from body');
    const allTasks: any[] = [];

    for (const item of items) {
      if (item.body) {
        const tasks = extractTasksFromMarkdown(item.body, item);
        allTasks.push(...tasks);
      }
    }

    console.log(`[Dataview] Extracted ${allTasks.length} tasks from ${items.length} files`);

    // For TASK queries, return the extracted tasks
    return { type: parsed.type, items: allTasks, fields: parsed.fields };
  }

  // Apply SORT
  if (parsed.sort) {
    items = executeSort(items, parsed.sort);
  }

  // Apply LIMIT
  if (parsed.limit) {
    items = items.slice(0, parsed.limit);
  }

  // Handle GROUP BY
  if (parsed.groupBy) {
    const grouped: Record<string, any[]> = {};
    items.forEach(item => {
      const key = item.data[parsed.groupBy!] || 'unknown';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return { type: parsed.type, grouped, fields: parsed.fields };
  }

  console.log(`[Dataview] Returning ${items.length} items of type ${parsed.type}`);
  return { type: parsed.type, items, fields: parsed.fields };
}

// Format field value for display
export function formatFieldValue(item: any, field: string): string {
  // Remove alias (e.g., "status as '状态'" -> "status")
  const fieldName = field.split(' as ')[0].trim();

  let value = item.data[fieldName];

  // Handle special fields
  if (fieldName === 'file.link' || fieldName === 'file') {
    return item.data.title || item.id;
  }

  // Format dates
  if (value instanceof Date) {
    return value.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Format arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Handle null/undefined
  if (value == null) {
    return '-';
  }

  return String(value);
}

// Get field display name (handle aliases)
export function getFieldDisplayName(field: string): string {
  const parts = field.split(' as ');
  if (parts.length > 1) {
    // Remove quotes from alias
    return parts[1].trim().replace(/^["']|["']$/g, '');
  }
  return parts[0].trim();
}
