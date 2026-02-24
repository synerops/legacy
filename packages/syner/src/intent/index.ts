/**
 * Intent Classification
 *
 * Fast classification of user intent using Haiku.
 */

import { generateObject, gateway } from 'ai'
import { intentSchema, instructions, type Intent } from './schema'

/**
 * Classify user intent.
 *
 * Uses Haiku for fast, cheap classification.
 *
 * @param prompt - User message to classify
 * @returns Classified intent with type, reasoning, and optional plan
 */
export async function classify(prompt: string): Promise<Intent> {
  const { object } = await generateObject({
    model: gateway('anthropic/claude-haiku-4.5'),
    schema: intentSchema,
    prompt: `${instructions}\n\nUser message: ${prompt}`,
  })

  return object
}

export { intentSchema, instructions, type Intent, type PlanSuggestion } from './schema'
