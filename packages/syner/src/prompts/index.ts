/**
 * Syner Prompts
 *
 * Modular prompt system for Syner. Each layer is loaded from a
 * separate markdown file and combined into a single system prompt.
 */

// @ts-expect-error — raw .md import handled by tsup loader
import identityRaw from './identity.md'
// @ts-expect-error — raw .md import handled by tsup loader
import guidelinesRaw from './guidelines.md'
// @ts-expect-error — raw .md import handled by tsup loader
import constraintsRaw from './constraints.md'
// @ts-expect-error — raw .md import handled by tsup loader
import toolsRaw from './tools.md'

export const identity: string = identityRaw
export const guidelines: string = guidelinesRaw
export const constraints: string = constraintsRaw
export const tools: string = toolsRaw

/**
 * Build the full system instructions from all prompt layers.
 *
 * @param extensionMd - Optional extension-specific instructions (e.g., Slack formatting)
 * @returns Combined system prompt
 */
export function instructions(extensionMd?: string): string {
  const layers = [identity, guidelines, constraints, tools]

  if (extensionMd) {
    layers.push(extensionMd)
  }

  return layers.join('\n\n')
}
