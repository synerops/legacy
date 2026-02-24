# @syner/sdk - Filesystem Module

Filesystem implementations for the [OSProtocol Fs interface](https://osprotocol.dev).

## Interfaces

| Interface | Description |
|-----------|-------------|
| `Fs` | Base interface (read, write, remove, list, exists) |
| `FsStreaming` | Extends Fs with streaming (readStream, writeStream) |

## Drivers

| Driver | Implements | Use case |
|--------|------------|----------|
| `createInMemoryFs()` | `Fs` | Testing, development |
| `createDiskFs()` | `FsStreaming` | Production, large files |

## Usage

### Basic (works with any driver)

```typescript
import { createSystem } from '@syner/sdk'

const system = createSystem()
const content = await system.fs.read('/sessions/auth/plan.md')
```

### With agentic tools

```typescript
import { createSystem, createFsTools } from '@syner/sdk'
import { generateText, gateway } from 'ai'

const system = createSystem()
const fsTools = createFsTools(system.fs)

const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4'),
  tools: fsTools,
  prompt: 'Read the file at /sessions/auth/context.md',
})
```

### Streaming (for large files)

```typescript
import { createSystem, isStreamable } from '@syner/sdk'

const system = createSystem()

if (isStreamable(system.fs)) {
  const stream = await system.fs.readStream('/runs/abc/output.log', signal)
  for await (const chunk of stream) {
    // Process incrementally
  }
}
```

### Testing with in-memory driver

```typescript
import { createSystem } from '@syner/sdk'

const system = createSystem({ inMemory: true })

// Tests run without filesystem side effects
await system.fs.write('/test/data.json', '{"key": "value"}')
```

## Security (disk driver)

The disk driver includes security measures:

- **Path traversal prevention** - Paths validated to stay within root
- **Symlink validation** - Targets checked to prevent escapes
- **Null byte injection** - Paths with null bytes rejected
- **Atomic writes** - Temp file + rename to prevent race conditions

## Directory Structure

Files are persisted to `.syner/` in the git root:

```
.syner/
├── sessions/
│   └── auth-feature/
│       ├── context.md
│       └── plans/
│           └── initial.md
├── runs/
│   └── abc123/
│       └── output.log
└── audits/
    └── 2024-01-15.json
```
