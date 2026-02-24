/**
 * Plan Tool
 *
 * Manages execution strategy with workflow and steps.
 * Uses Fs from @osprotocol/schema as backend.
 */

import { tool } from 'ai'
import type { Fs } from '@osprotocol/schema/system/fs'
import { planSchema, workflowSchema, type PlanInput, type Workflow } from './schema'

// @ts-expect-error — raw .md import handled by tsup loader
import instructionsMd from './instructions.md'
import matter from 'gray-matter'

const { data } = matter(instructionsMd)
const description = data.description as string

interface PlanMetadata {
  workflow: Workflow
  steps: string[]
}

function formatPlan(workflow: Workflow, steps: string[], content?: string): string {
  const lines = [
    '---',
    `workflow: ${workflow}`,
    'steps:',
    ...steps.map((s) => `  - ${s}`),
    '---',
    '',
  ]

  if (content) {
    lines.push(content)
  }

  return lines.join('\n')
}

function parsePlan(content: string): PlanMetadata | null {
  try {
    const { data } = matter(content)
    return {
      workflow: data.workflow as Workflow,
      steps: (data.steps as string[]) ?? [],
    }
  } catch {
    return null
  }
}

/**
 * Creates a plan tool bound to a session.
 *
 * @param fs - Filesystem implementation
 * @param sessionName - Session name for path scoping
 */
export function createPlanTool(fs: Fs, sessionName: string) {
  const basePath = `/sessions/${sessionName}/plans`

  return tool({
    description,
    inputSchema: planSchema,
    execute: async (input) => {
      const path = `${basePath}/${input.filename}`

      switch (input.command) {
        case 'view': {
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `Plan not found: ${input.filename}` }
          }

          const metadata = parsePlan(content)
          return {
            success: true,
            content,
            ...(metadata && { workflow: metadata.workflow, steps: metadata.steps }),
          }
        }

        case 'create': {
          if (!input.workflow || !input.steps) {
            return { success: false, error: 'workflow and steps are required for create' }
          }
          const content = formatPlan(input.workflow, input.steps, input.content)
          await fs.write(path, content)
          return {
            success: true,
            path,
            workflow: input.workflow,
            steps: input.steps,
            message: `Created plan ${input.filename}`,
          }
        }

        case 'str_replace': {
          if (!input.old_str || input.new_str === undefined) {
            return { success: false, error: 'old_str and new_str are required for str_replace' }
          }
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `Plan not found: ${input.filename}` }
          }
          if (!content.includes(input.old_str)) {
            return { success: false, error: `Text not found: "${input.old_str}"` }
          }
          const newContent = content.replace(input.old_str, input.new_str)
          await fs.write(path, newContent)
          return { success: true, path, message: `Updated ${input.filename}` }
        }

        case 'update_strategy': {
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `Plan not found: ${input.filename}` }
          }

          const metadata = parsePlan(content)
          if (!metadata) {
            return { success: false, error: `Invalid plan format: ${input.filename}` }
          }

          const { content: bodyContent } = matter(content)
          const newWorkflow = input.workflow ?? metadata.workflow
          const newSteps = input.steps ?? metadata.steps

          const newContent = formatPlan(newWorkflow, newSteps, bodyContent.trim())
          await fs.write(path, newContent)

          return {
            success: true,
            path,
            workflow: newWorkflow,
            steps: newSteps,
            message: `Updated strategy in ${input.filename}`,
          }
        }
      }
    },
  })
}

export { planSchema, workflowSchema, type PlanInput, type Workflow }
