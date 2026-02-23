/**
 * brain.ts - Syner's brain
 *
 * The think() function — central entry point for LLM responses.
 * Uses generateText + gateway() from AI SDK.
 */

import { generateText, streamText, gateway } from 'ai'

export interface ThinkOptions {
  systemPrompt: string
  model?: string
}

export interface ThinkResponse {
  text: string
}

export async function think(prompt: string, options: ThinkOptions): Promise<ThinkResponse> {
  const modelId = options.model
    ?? process.env.SYNER_ASSISTANT_MODEL
    ?? 'anthropic/claude-sonnet-4'

  const result = await generateText({
    model: gateway(modelId),
    system: options.systemPrompt,
    prompt,
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
 */
export function stream(prompt: string, options: ThinkOptions): StreamResponse {
  const modelId = options.model
    ?? process.env.SYNER_ASSISTANT_MODEL
    ?? 'anthropic/claude-sonnet-4'

  return streamText({
    model: gateway(modelId),
    system: options.systemPrompt,
    prompt,
  })
}
