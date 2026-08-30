# Syner OS

## What is Syner OS?

Syner OS is a Cloud for Agents that implements the [OS Protocol](https://github.com/synerops/protocol) specification. It provides a runtime environment where AI agents can operate with identity, skills, and structured workflows.

The OS enables agents to follow a disciplined loop: gather context, execute actions, validate with checks, and repeat. This pattern ensures predictable, auditable agent behavior.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- Node.js 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/synerops/syner.git
cd syner

# Install dependencies
bun install
```

### Development

```bash
# Run the OS application
bun run dev

# Or run only the OS app
bunx turbo run dev --filter=os
```

The app runs at `http://localhost:3000`.

## Learn More

- [OS Protocol](https://github.com/synerops/protocol) - The specification
- [@syner/sdk](../packages/sdk) - TypeScript SDK
- [syner.dev](https://syner.dev) - Documentation
