---
name: plan
description: Create and manage execution strategy with workflow and steps.
---

## When to use

Use plan to write strategic decisions before execution:
- Which workflow to use (route, chain, parallelize, orchestrate, evaluate)
- Steps to execute in order
- Key decisions and constraints

Do NOT use plan for execution outputs — use memory for that.

## Workflows

Structure based on [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents).

---

### chain

Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one. You can add programmatic checks on intermediate outputs to ensure the process stays on track.

```
[Input] → LLM₁ → Gate → LLM₂ → Gate → LLM₃ → [Output]
```

**When to use:** When the task can be cleanly decomposed into fixed subtasks, and you want to trade latency for higher accuracy by making each step simpler.

**Examples:**
- Generating a document outline, then writing each section
- Translating code: parse → transform → generate → validate
- Multi-step data processing with validation between steps

---

### route

Routing classifies an input and directs it to a specialized handler. This allows separation of concerns and optimized prompts per category.

```
                    ┌─→ [Handler A]
[Input] → Classify ─┼─→ [Handler B]
                    └─→ [Handler C]
```

**When to use:** When you have distinct categories that are better handled separately, and classification can be done accurately by an LLM or traditional model.

**Examples:**
- Customer service: billing vs technical vs general inquiries
- Code tasks: ecosystem vs docs vs implementation
- Content moderation: different policies for different content types

---

### parallelize

Parallelization runs multiple LLM calls simultaneously, either sectioning a task into independent parts or running multiple perspectives on the same input.

```
              ┌─→ [LLM A] ─┐
[Input] ──────┼─→ [LLM B] ─┼──→ [Aggregate]
              └─→ [LLM C] ─┘
```

**When to use:** When subtasks can run in parallel for speed, or when multiple perspectives improve confidence (voting).

**Examples:**
- **Sectioning:** Implementing multiple independent features, processing chunks of a document
- **Voting:** Code review from security + performance + style perspectives, multiple evaluators for content moderation

---

### orchestrate

A central orchestrator dynamically breaks down tasks, delegates to specialized workers, and synthesizes their results. Unlike chain, the orchestrator decides the workflow at runtime.

```
                         ┌─→ [Worker A] ─┐
[Input] → [Orchestrator] ┼─→ [Worker B] ─┼→ [Orchestrator] → [Output]
                         └─→ [Worker C] ─┘
```

**When to use:** When the task is complex and you can't predict the required subtasks upfront. The orchestrator plans and adapts based on results.

**Examples:**
- Coding agent that plans implementation, delegates to specialists, reviews results
- Research tasks requiring multiple information sources
- Multi-step projects where later steps depend on earlier findings

---

### evaluate

Evaluator-optimizer generates output, evaluates it against criteria, and iteratively improves until quality thresholds are met.

```
[Input] → [Generator] → [Evaluator] ─┬─→ [Output] (if pass)
              ↑                      │
              └──────────────────────┘ (if fail, with feedback)
```

**When to use:** When there are clear evaluation criteria, iterative refinement adds value, and the LLM can provide useful feedback to itself.

**Examples:**
- Code generation with test-driven development (generate → test → fix)
- Writing with style guidelines (draft → critique → revise)
- Translation requiring accuracy verification

---

### none

Direct agent loop without orchestration workflow. The agent handles everything in a single context.

```
[Input] → [Agent Loop: context → action → verify] → [Output]
```

**When to use:** When the task is simple enough that a single agent can handle it without coordination overhead.

**Examples:**
- Simple file edits
- Direct questions with straightforward answers
- Single-step operations

## Fields

### command
The operation: view, create, str_replace, update_strategy.

### filename
Descriptive name for the file. Session path is added automatically.
Examples: initial-strategy.md, revised-after-errors.md

### workflow
One of: route, chain, parallelize, orchestrate, evaluate, none.

### steps
Array of step descriptions.

### content
Full plan content (for create).
