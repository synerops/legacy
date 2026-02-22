/**
 * card.ts - Agent Card
 *
 * Parses SYNER.md frontmatter + content into an AgentCard.
 * Named after the A2A (Agent-to-Agent) protocol "Agent Card" concept.
 *
 * SYNER.md is imported as a raw string at build time via tsup loader.
 */

// @ts-expect-error — raw .md import handled by tsup loader
import synerMd from './SYNER.md'

export interface AgentCard {
  name: string
  description: string
  model: string
  content: string
}

let cached: AgentCard | null = null

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match?.[1] || !match[2]) return { data: {}, content: raw.trim() }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      if (key && value) data[key] = value
    }
  }

  return { data, content: match[2].trim() }
}

export function card(): AgentCard {
  if (cached) return cached

  const { data, content } = parseFrontmatter(synerMd)

  cached = {
    name: data.name ?? 'syner',
    description: data.description ?? '',
    model: data.model ?? 'anthropic/claude-sonnet-4',
    content,
  }

  return cached
}
