#!/usr/bin/env bun
/**
 * detect.ts - Intent detection for prompt classification
 *
 * Uses AI SDK generateObject with Claude Haiku to classify user prompts
 * into structured IntentClassification objects.
 *
 * Usage:
 *   bun run detect "your prompt here"
 *   echo "your prompt" | bun run detect
 */

import { generateObject } from 'ai'
import { gateway } from 'ai'
import { IntentClassificationSchema } from '../intent'

const SYSTEM_PROMPT = `You are an intent classifier for a Cloud for Agents.

Analyze the user's prompt and classify it according to:

1. **Intent Type**:
   - direct: Simple greeting, acknowledgment, or conversational response
   - execute: Clear single action to perform
   - plan: Complex task requiring planning phase
   - delegate: Task requiring specialized workflow/agent
   - clarify: Ambiguous request needing clarification

2. **Complexity**:
   - depth (1-5): How many sequential steps are needed
   - width (1-5): How many different specialties/domains involved
   - estimated: simple (<3 depth, <2 width), moderate, complex

3. **Strategy**:
   - requires_planning: true if task needs upfront planning
   - suggested_workflow: route, orchestrate, parallelize, evaluate, or null
   - suggested_agent: worker, specialist, reviewer, orchestrator, or null

4. **Next Action**:
   - respond: Just respond conversationally
   - execute: Execute the task directly
   - plan: Enter planning mode
   - delegate: Delegate to workflow
   - ask: Ask user for clarification

Be precise and consistent. Simple greetings should NOT trigger orchestration.`

async function main() {
  // Get prompt from args or stdin
  let prompt = process.argv[2]

  if (!prompt) {
    // Read from stdin if no argument
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) {
      chunks.push(chunk)
    }
    prompt = Buffer.concat(chunks).toString().trim()
  }

  if (!prompt) {
    console.error('Usage: bun run detect "your prompt"')
    process.exit(1)
  }

  const modelId = process.env.SYNER_CLASSIFIER_MODEL || 'anthropic/claude-3.5-haiku'

  const { object } = await generateObject({
    model: gateway(modelId),
    schema: IntentClassificationSchema,
    system: SYSTEM_PROMPT,
    prompt: `Classify this prompt:\n\n${prompt}`,
  })

  console.log(JSON.stringify(object, null, 2))
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
