# syner

Default orchestrator agent for Syner OS.

## Role

Syner is the meta-orchestrator that:
1. **Classifies** incoming requests
2. **Routes** to specialized agents/workflows
3. **Orchestrates** multi-step tasks
4. **Synthesizes** results

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         SYNER                                │
│                    (Syner class)                            │
├─────────────────────────────────────────────────────────────┤
│  Workflows (orchestration patterns)                         │
│  route, orchestrate, parallelize, evaluate, chain           │
├─────────────────────────────────────────────────────────────┤
│  Prompts (modular system)                                   │
│  identity + guidelines + constraints + tools                │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
├── SYNER.md              # Agent identity (entry point)
└── src/
    ├── index.ts          # Public exports
    ├── brain.ts          # Syner class + workflow tools
    └── prompts/
        ├── index.ts      # instructions() builder
        ├── identity.md
        ├── guidelines.md
        ├── constraints.md
        └── tools.md
```

## Prompt Layers

| Layer | File | Purpose |
|-------|------|---------|
| 1 | `identity.md` | Role, cognitive system, agent loop |
| 2 | `guidelines.md` | How to think, communicate, principles |
| 3 | `constraints.md` | What NOT to do |
| 4 | `tools.md` | Workflow tool descriptions |
| ext | Extension `.md` | Platform-specific (e.g., Slack formatting) |

## Workflow Tools

| Tool | Pattern | Use when |
|------|---------|----------|
| `route` | Classify → delegate | Task needs ONE handler |
| `orchestrate` | Plan → workers → synthesize | Multiple specialists sequentially |
| `parallelize` | Split → parallel → merge | Subtasks are independent |
| `evaluate` | Generate → evaluate → optimize | Quality is critical |
| `chain` | Pipeline (output → input) | Steps depend on previous |

## Usage

```typescript
import { syner } from 'syner'

// Generate with built-in workflow tools
const { text } = await syner.generate({
  prompt: 'Help me plan this migration',
  tools: { /* additional tools */ },
})

// With extension instructions
import { synerMd } from '@syner/slack'

const { text } = await syner.generate({
  prompt: event.text,
  md: synerMd,
})
```

## Extending

Create extension SYNER.md files for platform-specific behavior:

```typescript
// extensions/slack/SYNER.md
# Slack Extension

- Use Slack formatting: *bold*, _italic_, `code`
- Be concise, conversational
- Match user's language

// extensions/slack/index.ts
import synerMdRaw from '../SYNER.md'
export const synerMd: string = synerMdRaw
```
