# syner

The orchestrator agent of Syner OS.

## Install

```bash
npm install syner
```

## Usage

```typescript
import { syner } from 'syner'

const { text } = await syner.generate({
  prompt: 'Help me plan this migration',
})
```

With extension instructions:

```typescript
import { syner } from 'syner'
import { synerMd } from '@syner/slack'

const { text } = await syner.generate({
  prompt: event.text,
  md: synerMd,
  tools: { ... },
})
```

## API

### `syner.generate(options)`

| Option | Type | Description |
|--------|------|-------------|
| `prompt` | `string` | User prompt |
| `md` | `string?` | Extension instructions |
| `tools` | `Record<string, Tool>?` | Additional tools |
| `maxSteps` | `number?` | Max steps (default: 20) |
| `model` | `string?` | Override model |

### `syner.stream(options)`

Same as generate, but returns `{ textStream }`. No tools support.

### `syner.card`

Agent metadata: `{ name, description, model, content }`

## License

MIT
