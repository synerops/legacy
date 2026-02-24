/**
 * Memory Tool Schema
 *
 * Zod schema for the memory tool that persists execution context.
 */

import { z } from 'zod'

export const memorySchema = z.object({
  command: z
    .enum(['view', 'create', 'str_replace', 'insert', 'delete'])
    .describe('Operation: view, create, str_replace, insert, delete'),
  filename: z.string().describe('File to operate on (e.g., codebase-analysis.md)'),
  content: z.string().optional().describe('File content (required for create)'),
  old_str: z.string().optional().describe('Text to find (for str_replace)'),
  new_str: z.string().optional().describe('Text to replace with (for str_replace/insert)'),
  insert_line: z
    .number()
    .optional()
    .describe('Line number to insert after, 0 for beginning (for insert)'),
})

export type MemoryInput = z.infer<typeof memorySchema>
