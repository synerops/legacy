/**
 * brain.ts - Syner's brain
 *
 * The think() function — central entry point for LLM responses.
 * Uses generateText + gateway() from AI SDK.
 */

import { generateText, gateway } from 'ai'
import { card } from './card'

export interface ThinkOptions {
  systemPrompt?: string
  model?: string
}

export interface ThinkResponse {
  text: string
}

export async function think(prompt: string, options?: ThinkOptions): Promise<ThinkResponse> {
  const modelId = options?.model
    ?? process.env.SYNER_ASSISTANT_MODEL
    ?? 'anthropic/claude-sonnet-4'

  const systemPrompt = options?.systemPrompt ?? card().content

  const result = await generateText({
    model: gateway(modelId),
    system: systemPrompt,
    prompt,
  })

  return { text: result.text }
}
