/**
 * brain.ts - Syner's brain
 *
 * The think() function — central entry point for LLM responses.
 * Uses generateText + gateway() from AI SDK.
 */

import { generateText, streamText, gateway, stepCountIs } from 'ai'
import type { Tool } from 'ai'

/**
 * Model alias mappings to full AI SDK gateway model IDs.
 * Allows using short aliases like 'sonnet' instead of 'anthropic/claude-sonnet-4'.
 */
export const models = {
  sonnet: 'anthropic/claude-sonnet-4',
  opus: 'anthropic/claude-opus-4',
  haiku: 'anthropic/claude-haiku-3',
} as const

/**
 * Resolves a model alias to its full model ID.
 * If the id is not a known alias, it's returned as-is (passthrough).
 */
function resolveModel(id: string): string {
  return models[id as keyof typeof models] ?? id
}

export interface ThinkOptions {
  systemPrompt: string
  model?: string
}

export interface ThinkWithToolsOptions extends ThinkOptions {
  /** Tools available for the model to use */
  tools: Record<string, Tool>
  /** Maximum agentic steps (default: 20, matching AI SDK default) */
  maxSteps?: number
}

export interface ThinkResponse {
  text: string
}

export async function think(prompt: string, options: ThinkOptions | ThinkWithToolsOptions): Promise<ThinkResponse> {
  const modelId = resolveModel(
    options.model
      ?? process.env.SYNER_ASSISTANT_MODEL
      ?? 'sonnet'
  )

  const hasTools = 'tools' in options && options.tools

  const result = await generateText({
    model: gateway(modelId),
    system: options.systemPrompt,
    prompt,
    ...(hasTools && {
      tools: options.tools,
      stopWhen: stepCountIs(options.maxSteps ?? 20),
    }),
  })

  return { text: result.text }
}

export interface StreamResponse {
  /** Async iterable of text deltas as they arrive from the model */
  textStream: AsyncIterable<string>
}

/**
 * Streams an LLM response as an async iterable of text deltas.
 *
 * Use `.textStream` to iterate over chunks as they arrive from the model.
 *
 * Note: Does not support tools. Use think() for agentic behavior.
 */
export function stream(prompt: string, options: ThinkOptions): StreamResponse {
  const modelId = resolveModel(
    options.model
      ?? process.env.SYNER_ASSISTANT_MODEL
      ?? 'sonnet'
  )

  return streamText({
    model: gateway(modelId),
    system: options.systemPrompt,
    prompt,
  })
}
