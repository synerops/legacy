/**
 * Plan Tool Schema
 *
 * Zod schema for the plan tool that manages execution strategy.
 */

import { z } from 'zod'

export const workflowSchema = z.enum([
  'route',
  'chain',
  'parallelize',
  'orchestrate',
  'evaluate',
  'none',
])

export type Workflow = z.infer<typeof workflowSchema>

export const planSchema = z.object({
  command: z
    .enum(['view', 'create', 'str_replace', 'update_strategy'])
    .describe('Operation: view, create, str_replace, update_strategy'),
  filename: z.string().describe('File to operate on (e.g., initial-strategy.md)'),
  workflow: workflowSchema
    .optional()
    .describe('Orchestration pattern (for create/update_strategy)'),
  steps: z.array(z.string()).optional().describe('Steps to execute (for create/update_strategy)'),
  content: z.string().optional().describe('Additional plan content (for create)'),
  old_str: z.string().optional().describe('Text to find (for str_replace)'),
  new_str: z.string().optional().describe('Text to replace with (for str_replace)'),
})

export type PlanInput = z.infer<typeof planSchema>
