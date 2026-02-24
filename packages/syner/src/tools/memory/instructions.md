---
name: memory
description: Store and retrieve execution context from agents.
---

## When to use

Use memory to save execution context:
- Files found, patterns identified
- Changes made, commands run
- Test results, verification outcomes

Do NOT use memory for strategic decisions — use plan for that.

## Fields

### command
The operation: view, create, str_replace, insert, delete.

### filename
Descriptive name for the file. Session path is added automatically.
Examples: codebase-analysis.md, changes-applied.md, test-results.md

### content
File content (required for create).

### old_str / new_str
For str_replace operations.

### insert_line / new_str
For insert operations. insert_line is the line number to insert after (0 for beginning).
