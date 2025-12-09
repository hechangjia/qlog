// Extract Dataview code blocks from markdown content

export interface DataviewBlock {
  title?: string;
  description?: string;
  query: string;
  type: 'dataview' | 'dataviewjs';
}

/**
 * Extract Dataview code blocks from markdown content
 * Looks for blocks like:
 * ### Title
 * Description text
 * ```dataview
 * query here
 * ```
 */
export function extractDataviewBlocks(markdown: string): DataviewBlock[] {
  const blocks: DataviewBlock[] = [];

  // Split by headings to get sections
  const sections = markdown.split(/^###\s+/m).slice(1); // Skip content before first heading

  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0].trim();

    // Find description (text between title and code block)
    let description = '';
    let inCodeBlock = false;
    let codeBlockType: 'dataview' | 'dataviewjs' | null = null;
    let query = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Check for code block start
      if (line.trim().startsWith('```dataview')) {
        inCodeBlock = true;
        codeBlockType = 'dataview';
        continue;
      }
      if (line.trim().startsWith('```dataviewjs')) {
        inCodeBlock = true;
        codeBlockType = 'dataviewjs';
        continue;
      }

      // Check for code block end
      if (line.trim() === '```' && inCodeBlock) {
        // Save this block
        if (query.trim() && codeBlockType) {
          blocks.push({
            title,
            description: description.trim(),
            query: query.trim(),
            type: codeBlockType
          });
        }

        // Reset for next block
        inCodeBlock = false;
        codeBlockType = null;
        query = '';
        description = '';
        continue;
      }

      // Collect query content
      if (inCodeBlock) {
        query += line + '\n';
      }
      // Collect description (but stop at next heading or code block)
      else if (!line.startsWith('#') && !line.trim().startsWith('```')) {
        description += line + '\n';
      }
    }
  }

  return blocks;
}

/**
 * Group Dataview blocks by their parent heading (## heading)
 */
export function groupDataviewBlocks(markdown: string): Record<string, DataviewBlock[]> {
  const grouped: Record<string, DataviewBlock[]> = {};

  // Split by ## headings
  const h2Sections = markdown.split(/^##\s+/m).slice(1);

  for (const h2Section of h2Sections) {
    const lines = h2Section.split('\n');
    const groupName = lines[0].trim();

    // Get the content after the h2 heading
    const content = lines.slice(1).join('\n');

    // Extract blocks from this section
    const blocks = extractDataviewBlocks('### ' + content);

    if (blocks.length > 0) {
      grouped[groupName] = blocks;
    }
  }

  return grouped;
}
