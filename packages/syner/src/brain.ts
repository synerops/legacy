/**
 * syner.ts - Syner Agent
 *
 * The Syner class wraps AI SDK's generateText with a modular prompt
 * system and workflow tools.
 */

import { generateText, streamText, gateway, stepCountIs, tool } from 'ai'
import type { Tool } from 'ai'
import { z } from 'zod'
import matter from 'gray-matter'
import { instructions } from './prompts'
import { createMemoryFs } from '@syner/sdk'
import { createMemoryTool } from './tools/memory'
import { createPlanTool } from './tools/plan'
import { classify, type Intent } from './intent'

// @ts-expect-error — raw .md import handled by tsup loader
import synerMdRaw from '../SYNER.md'

// -----------------------------------------------------------------------------
// Workflow Tools
// -----------------------------------------------------------------------------

const routeInputSchema = z.object({
  task: z.string().describe('The task to route'),
  routeKey: z
    .enum(['ecosystem', 'osprotocol', 'code', 'docs'])
    .describe('The specialist to delegate to'),
})

const route = tool({
  description:
    'Classify and delegate to a single specialist. Use when the task needs ONE specific handler.',
  inputSchema: routeInputSchema,
  execute: async ({ task, routeKey }) => {
    // TODO: Implement delegation logic
    return { status: 'routed', routeKey, task }
  },
})

const orchestrateInputSchema = z.object({
  task: z.string().describe('The task to orchestrate'),
  steps: z.array(z.string()).describe('The steps to execute'),
})

const orchestrate = tool({
  description:
    'Plan, delegate to multiple workers, and synthesize results. Use when the task requires multiple specialists working sequentially.',
  inputSchema: orchestrateInputSchema,
  execute: async ({ task, steps }) => {
    // TODO: Implement orchestration logic
    return { status: 'orchestrated', task, steps }
  },
})

const parallelizeInputSchema = z.object({
  task: z.string().describe('The task to parallelize'),
  subtasks: z
    .array(z.string())
    .describe('Independent subtasks to run in parallel'),
})

const parallelize = tool({
  description:
    'Split into independent subtasks, execute in parallel, and merge results. Use when subtasks can run concurrently.',
  inputSchema: parallelizeInputSchema,
  execute: async ({ task, subtasks }) => {
    // TODO: Implement parallel execution
    return { status: 'parallelized', task, subtasks }
  },
})

const evaluateInputSchema = z.object({
  task: z.string().describe('The task to evaluate'),
  criteria: z.array(z.string()).describe('Quality criteria to evaluate against'),
})

const evaluate = tool({
  description:
    'Generate, evaluate against criteria, and optimize iteratively. Use when quality is critical.',
  inputSchema: evaluateInputSchema,
  execute: async ({ task, criteria }) => {
    // TODO: Implement evaluation loop
    return { status: 'evaluated', task, criteria }
  },
})

const chainInputSchema = z.object({
  task: z.string().describe('The task to chain'),
  pipeline: z.array(z.string()).describe('Sequential steps in the pipeline'),
})

const chain = tool({
  description:
    'Sequential pipeline where each step output becomes next step input. Use when steps depend on previous results.',
  inputSchema: chainInputSchema,
  execute: async ({ task, pipeline }) => {
    // TODO: Implement chaining logic
    return { status: 'chained', task, pipeline }
  },
})

/** Built-in workflow tools */
const workflowTools = {
  route,
  orchestrate,
  parallelize,
  evaluate,
  chain,
}

// -----------------------------------------------------------------------------
// Model Resolution
// -----------------------------------------------------------------------------

/**
 * Model alias mappings to full AI SDK gateway model IDs.
 */
export const models = {
  sonnet: 'anthropic/claude-sonnet-4',
  opus: 'anthropic/claude-opus-4',
  haiku: 'anthropic/claude-haiku-4.5',
} as const

function resolveModel(id: string): string {
  return models[id as keyof typeof models] ?? id
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AgentCard {
  name: string
  description: string
  model: string
  content: string
}

export interface GenerateOptions {
  /** User prompt */
  prompt: string
  /** Extension-specific instructions to append to system prompt */
  md?: string
  /** Additional tools to make available */
  tools?: Record<string, Tool>
  /** Maximum agentic steps (default: 20) */
  maxSteps?: number
  /** Override the default model */
  model?: string
}

export interface GenerateResponse {
  text: string
}

export interface StreamOptions {
  /** User prompt */
  prompt: string
  /** Extension-specific instructions to append to system prompt */
  md?: string
  /** Override the default model */
  model?: string
}

export interface StreamResponse {
  /** Async iterable of text deltas as they arrive from the model */
  textStream: AsyncIterable<string>
}

// -----------------------------------------------------------------------------
// Syner Class
// -----------------------------------------------------------------------------

export class Syner {
  private _card: AgentCard | null = null

  /** Parse and cache the agent card from SYNER.md */
  get card(): AgentCard {
    if (this._card) return this._card

    const { data, content } = matter(synerMdRaw)

    this._card = {
      name: (data.name as string) ?? 'syner',
      description: (data.description as string) ?? '',
      model: (data.model as string) ?? 'sonnet',
      content: content.trim(),
    }

    return this._card
  }

  /** Shorthand for card.name */
  get name(): string {
    return this.card.name
  }

  /** Shorthand for card.description */
  get description(): string {
    return this.card.description
  }

  /**
   * Generate a response using Syner's system prompt and workflow tools.
   */
  async generate(options: GenerateOptions): Promise<GenerateResponse> {
    const modelId = resolveModel(
      options.model ?? process.env.SYNER_ASSISTANT_MODEL ?? this.card.model
    )

    const systemPrompt = instructions(options.md)

    const allTools = {
      ...workflowTools,
      ...options.tools,
    }

    const result = await generateText({
      model: gateway(modelId),
      system: systemPrompt,
      prompt: options.prompt,
      tools: allTools,
      stopWhen: stepCountIs(options.maxSteps ?? 20),
    })

    return { text: result.text }
  }

  /**
   * Stream a response as an async iterable of text deltas.
   *
   * Note: Streaming does not support tools. Use generate() for agentic behavior.
   */
  stream(options: StreamOptions): StreamResponse {
    const modelId = resolveModel(
      options.model ?? process.env.SYNER_ASSISTANT_MODEL ?? this.card.model
    )

    const systemPrompt = instructions(options.md)

    return streamText({
      model: gateway(modelId),
      system: systemPrompt,
      prompt: options.prompt,
    })
  }

  /**
   * Ask Syner with orchestration.
   *
   * Entry point that classifies intent, creates a session,
   * and generates a response with memory + plan tools.
   *
   * @param prompt - User message
   * @returns GenerateResponse (same as generate())
   */
  async ask(prompt: string): Promise<GenerateResponse> {
    // 1. Classify intent (includes sessionName)
    const intent = await classify(prompt)

    // 2. Create session with Fs
    const fs = createMemoryFs()
    const memory = createMemoryTool(fs, intent.sessionName)
    const plan = createPlanTool(fs, intent.sessionName)

    // 3. Handle based on intent type
    const handlers: Record<Intent['type'], () => Promise<GenerateResponse>> = {
      respond: () => this.generate({ prompt }),

      clarify: () =>
        this.generate({
          prompt: `${prompt}\n\nPlease ask a clarifying question: ${intent.reasoning}`,
        }),

      act: () => this.generate({ prompt, tools: { memory, plan } }),
    }

    return handlers[intent.type]()
  }
}

// -----------------------------------------------------------------------------
// Singleton
// -----------------------------------------------------------------------------

export const syner = new Syner()
