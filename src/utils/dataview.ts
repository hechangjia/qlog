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
  withoutId?: boolean; // 新增：标记是否隐藏 ID/Link 列
}

// 解析器：支持更复杂的语法
export function parseDataviewQuery(query: string): DataviewQuery {
  const normalizedQuery = query.replace(/[\r\n]+/g, ' ').trim();

  // 1. 提取类型
  let type: DataviewQueryType = 'LIST';
  if (/^TABLE/i.test(normalizedQuery)) type = 'TABLE';
  else if (/^LIST/i.test(normalizedQuery)) type = 'LIST';
  else if (/^TASK/i.test(normalizedQuery)) type = 'TASK';

  // 2. 处理 WITHOUT ID
  const withoutId = /WITHOUT\s+ID/i.test(normalizedQuery);
  // 移除 TYPE 和 WITHOUT ID，剩下的部分用于提取字段
  let cleanQuery = normalizedQuery
    .replace(/^(TABLE|LIST|TASK|CALENDAR)/i, '')
    .replace(/WITHOUT\s+ID/i, '')
    .trim();

  // 3. 提取各个子句 (FROM, WHERE...)
  const keywords = ['FROM', 'WHERE', 'SORT', 'LIMIT', 'GROUP BY', 'FLATTEN'];
  const getClause = (text: string, keyword: string): string => {
    const regex = new RegExp(`${keyword}\\s+(.+?)(?:\\s+(?:${keywords.join('|')})|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  // 4. 提取字段列表 (Fields)
  // 字段位于开头，直到遇到第一个关键词
  let fields: string[] = [];
  const firstKeywordIndex = cleanQuery.search(new RegExp(`\\s+(${keywords.join('|')})\\s+`, 'i'));
  const fieldsString = firstKeywordIndex > -1 ? cleanQuery.substring(0, firstKeywordIndex) : cleanQuery;
  
  if (fieldsString.trim() && type === 'TABLE') {
    // 简单的逗号分割，暂不支持函数内的逗号
    fields = fieldsString.split(',').map(f => f.trim()).filter(f => f);
  }

  // 5. 提取其他属性
  let from = getClause(cleanQuery, 'FROM').replace(/^["']|["']$/g, '');
  const where = getClause(cleanQuery, 'WHERE');
  const groupBy = getClause(cleanQuery, 'GROUP BY');
  
  const sortClause = getClause(cleanQuery, 'SORT');
  let sort: { field: string; direction: 'ASC' | 'DESC' }[] = [];
  if (sortClause) {
    sort = sortClause.split(',').map(s => {
      const [f, d] = s.trim().split(/\s+/);
      return { field: f, direction: (d?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') };
    });
  }

  const limitClause = getClause(cleanQuery, 'LIMIT');
  const limit = limitClause ? parseInt(limitClause) : undefined;

  return { type, fields, from, where, sort, limit, groupBy, withoutId };
}

// 简单的条件评估
function evaluateWhere(item: any, whereClause: string): boolean {
  if (!whereClause) return true;
  const lowerClause = whereClause.toLowerCase();

  // 简单的包含逻辑检查
  if (lowerClause.includes('priority')) {
    const p = item.data.priority;
    if (lowerClause.includes('"high"') && p !== 'high') return false;
    if (lowerClause.includes('"medium"') && p !== 'medium') return false;
    if (lowerClause.includes('"low"') && p !== 'low') return false;
  }
  
  if (lowerClause.includes('status')) {
    const s = item.data.status;
    if (lowerClause.includes('!= "done"') && s === 'done') return false;
    if (lowerClause.includes('= "done"') && s !== 'done') return false;
    if (lowerClause.includes('= "in-progress"') && s !== 'in-progress') return false;
  }

  if (lowerClause.includes('category')) {
     const c = item.data.category;
     if (lowerClause.includes('!= null') && !c) return false;
  }

  // 日期范围 (简单 mock)
  if (lowerClause.includes('duedate') && lowerClause.includes('date(today)')) {
     if (!item.data.dueDate) return false;
     // 这里简化处理，只要有 dueDate 就返回 true，实际需比较时间戳
     return true; 
  }

  return true;
}

// 执行查询
export async function executeDataviewQuery(
  query: string,
  collections: Record<string, CollectionEntry<any>[]>
): Promise<any> {
  const parsed = parseDataviewQuery(query);
  
  // 1. 获取数据源
  let items: any[] = [];
  const fromKey = parsed.from.toLowerCase();
  if (collections[fromKey]) items = collections[fromKey];
  else if (fromKey === 'todo') items = collections.todo || []; // Fallback specific to your setup
  else if (fromKey === 'diary') items = collections.diary || [];
  else if (fromKey === 'posts') items = collections.posts || [];

  // 2. 过滤
  if (parsed.where) {
    items = items.filter(item => evaluateWhere(item, parsed.where!));
  }

  // 3. 排序
  if (parsed.sort && parsed.sort.length > 0) {
    items.sort((a, b) => {
      const field = parsed.sort![0].field; // 简化：只取第一个排序条件
      const valA = a.data[field] || 0;
      const valB = b.data[field] || 0;
      if (valA < valB) return parsed.sort![0].direction === 'ASC' ? -1 : 1;
      if (valA > valB) return parsed.sort![0].direction === 'ASC' ? 1 : -1;
      return 0;
    });
  }

  // 4. 分组 (GROUP BY) - 支持聚合统计
  if (parsed.groupBy) {
    const grouped: Record<string, any[]> = {};
    items.forEach(item => {
      const key = item.data[parsed.groupBy!] || '无';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    // 如果是 TABLE 查询且包含聚合函数 (length)
    if (parsed.type === 'TABLE' && parsed.fields?.some(f => f.toLowerCase().includes('length') || f.toLowerCase().includes('rows'))) {
       const aggregatedItems = Object.entries(grouped).map(([key, rows]) => {
          return {
             id: key,
             collection: fromKey,
             data: {
               // 动态构造聚合数据
               [parsed.groupBy!]: key,
               rows: rows, // 保留原始行数据
               // 简单的长度计算 mock
               'length(rows)': rows.length, 
               '任务数': rows.length,
               '总数': rows.length
             }
          };
       });
       // 对聚合结果排序
       aggregatedItems.sort((a, b) => b.data['rows'].length - a.data['rows'].length);
       
       return { type: 'TABLE', items: aggregatedItems, fields: parsed.fields, withoutId: true };
    }

    // 普通分组展示
    return { type: parsed.type, grouped, fields: parsed.fields, withoutId: parsed.withoutId };
  }

  // 5. 限制数量
  if (parsed.limit) {
    items = items.slice(0, parsed.limit);
  }

  return { type: parsed.type, items, fields: parsed.fields, withoutId: parsed.withoutId };
}

// 格式化字段值
export function formatFieldValue(item: any, fieldRaw: string): any {
  // 处理 Alias: field AS "Name"
  const [fieldExp, alias] = fieldRaw.split(/\s+AS\s+/i);
  const fieldName = fieldExp.trim();

  // 1. 处理特殊字段
  if (fieldName === 'file.link' || fieldName === 'file') {
    return `<a href="/${item.collection}/${item.id}" class="text-indigo-600 hover:underline">${item.data.title || item.id}</a>`;
  }

  // 2. 处理聚合字段 (针对 Group By 后的结果)
  if (fieldName === 'length(rows)' || fieldName.includes('length(')) {
     return item.data.rows?.length || item.data[fieldName] || 0;
  }
  // 复杂的 filter(rows...) 暂时返回 "不支持" 或者简化的数量
  if (fieldName.includes('filter(')) {
     // 尝试智能推断: 如果是 "已完成" 且有 filter
     if (alias && alias.includes('完成')) {
        return item.data.rows?.filter((r:any) => r.data.status === 'done').length || 0;
     }
     if (alias && alias.includes('进行')) {
        return item.data.rows?.filter((r:any) => r.data.status === 'in-progress').length || 0;
     }
     if (alias && alias.includes('待办') || alias.includes('未完成')) {
        return item.data.rows?.filter((r:any) => r.data.status === 'todo').length || 0;
     }
     return '-';
  }

  // 3. 普通属性
  let value = item.data[fieldName];
  
  // 尝试大小写
  if (value === undefined) value = item.data[fieldName.toLowerCase()];

  if (value instanceof Date) {
    return value.toLocaleDateString('zh-CN');
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  // 进度条渲染
  if (fieldName === 'progress') {
      return `<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${value}%"></div>
      </div>`;
  }

  if (value == null) return '-';
  return value;
}

export function getFieldDisplayName(fieldRaw: string): string {
  const parts = fieldRaw.split(/\s+AS\s+/i);
  if (parts.length > 1) {
    return parts[1].replace(/^["']|["']$/g, '');
  }
  // 如果是 file.link 显示为 "文件"
  if (parts[0].trim() === 'file.link') return '标题';
  return parts[0].trim().toUpperCase();
}