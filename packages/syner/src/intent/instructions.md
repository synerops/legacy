---
name: intent
instructions: Classify the user intent based on their message.
---

## Fields

### type
The classification result:
- respond: Direct answer, greeting, or explanation (no tools needed)
- act: Requires action - create, modify, run, implement, fix
- clarify: Missing info - ambiguous request, needs more context

### reasoning
Brief explanation of why this classification was chosen.

### plan
Only when type is "act". Initial strategy suggested by classifier.
This is passed to Syner who can persist/refine it using the plan tool.

### plan.workflow
Orchestration pattern: route, chain, parallelize, orchestrate, evaluate, none.
Use "none" for basic agent loop without workflow.

### plan.steps
List of steps to execute in order.

### sessionName
Descriptive name for the session based on the task.
Examples: "auth-feature", "login-fix", "api-refactor"

**Relation intent.plan vs plan tool:**
- `intent.plan` = initial suggestion from classifier (Haiku)
- `plan tool` = Syner persists/updates the plan during execution
