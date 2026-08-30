# Syner OS

## What is Syner OS?

Syner OS is **a Cloud for Agents** where:

1. **Semantic**: The "source code" are `.md` files (SKILL.md, AGENT.md) that define behavior in natural language
2. **Agentic**: AI agents orchestrate workflows, with **Syner** as the default meta-orchestrator
3. Users create, customize, and orchestrate agents by modifying markdown files

## Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OS PROTOCOL                              │
│                 (Defines CONTRACTS)                         │
│                                                             │
│  - TypeScript interfaces in @osprotocol/schema              │
│  - "A Filesystem MUST have readFile(), writeFile()"         │
│  - Agnostic to implementation                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ implements
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       SDK                                   │
│            (DEFAULT Implementation)                         │
│                                                             │
│  - @syner/sdk provides base workflow classes                │
│  - Works out-of-the-box without extensions                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ can replace
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTENSIONS                               │
│           (ALTERNATIVE Implementations)                     │
│                                                             │
│  @syner/github   - GitHub OAuth and API                     │
│  @syner/upstash  - Distributed Redis cache                  │
│  @syner/vercel   - Secure sandbox execution                 │
└─────────────────────────────────────────────────────────────┘
```

**Key Rule**: Protocol defines contracts, SDK implements defaults, Extensions replace.

## Documentation Hierarchy

Syner uses hierarchical AGENTS.md files to avoid redundancy:

| Location | Purpose |
|----------|---------|
| `/AGENTS.md` | Project vision and architecture (this file) |
| `/CLAUDE.md` | Commands, structure, coding conventions |
| `/apps/*/AGENTS.md` | App-specific rules |
| `/packages/*/AGENTS.md` | Package architecture |
| `/extensions/*/AGENTS.md` | Extension usage and APIs |

**Rules:**
- Root = context ("what is this?")
- CLAUDE.md = technical reference ("how do I work here?")
- Package/Extension = implementation details ("how does X work?")
- NEVER duplicate information across levels

## OS Protocol

Before implementing agents or modifying the SDK, fetch the protocol specification:

```bash
curl -s 'https://raw.githubusercontent.com/synerops/osprotocol/refs/heads/main/SYNER.md'
```

The protocol defines:
- Agent loop: `context (read) → actions (execute) → checks (validate) → repeat`
- Six domains: System, Context, Actions, Checks, Workflows, Runs
- Scope boundaries: what belongs in the protocol vs infrastructure

## Domains

| Domain | App | Purpose |
|--------|-----|---------|
| `syner.app` | apps/os | Main OS interface |
| `syner.bot` | apps/os/api/v1/* | API (same deploy) |
| `syner.dev` | apps/dev | Developer hub, docs, auth |
| `syner.design` | apps/design | Design system documentation |
