/**
 * card.ts - Agent Card
 *
 * Parses SYNER.md frontmatter + content into an AgentCard.
 * Named after the A2A (Agent-to-Agent) protocol "Agent Card" concept.
 *
 * SYNER.md is imported as a raw string at build time via tsup loader.
 */

import matter from 'gray-matter'

// @ts-expect-error — raw .md import handled by tsup loader
import synerMd from './SYNER.md'

export interface AgentCard {
  name: string
  description: string
  model: string
  content: string
}

let cached: AgentCard | null = null

export function card(): AgentCard {
  if (cached) return cached

  const { data, content } = matter(synerMd)

  cached = {
    name: (data.name as string) ?? 'syner',
    description: (data.description as string) ?? '',
    model: (data.model as string) ?? 'anthropic/claude-sonnet-4',
    content: content.trim(),
  }

  return cached
}
