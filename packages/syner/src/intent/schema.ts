/**
 * Intent Classification Schema
 *
 * Zod schema for classifying user intent.
 */

import { z } from 'zod'
import { workflowSchema } from '../tools/plan/schema'

// @ts-expect-error — raw .md import handled by tsup loader
import instructionsMd from './instructions.md'
import matter from 'gray-matter'

const { data, content } = matter(instructionsMd)

export const instructions = `${data.instructions}\n\n${content}`

const planSuggestionSchema = z.object({
  workflow: workflowSchema.describe('Orchestration pattern to use'),
  steps: z.array(z.string()).describe('Steps to execute in order'),
})

export const intentSchema = z.object({
  type: z
    .enum(['respond', 'act', 'clarify'])
    .describe('respond: no tools needed | act: requires action | clarify: needs more context'),
  reasoning: z.string().describe('Brief explanation of classification'),
  plan: planSuggestionSchema
    .optional()
    .describe('Initial strategy (only when type is "act")'),
  sessionName: z
    .string()
    .describe('Descriptive session name based on task (e.g., "auth-feature", "login-fix")'),
})

export type Intent = z.infer<typeof intentSchema>
export type PlanSuggestion = z.infer<typeof planSuggestionSchema>
