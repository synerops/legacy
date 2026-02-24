/**
 * Syner Agentic OS SDK
 *
 * Implements the OS Protocol specification
 */

// Lib (types + runtime infrastructure - NOT part of protocol)
export * from './lib'

// System (protocol/system/*)
export type { Sandbox, CreateSandboxOptions, Filesystem } from './system'
export { env } from './system'

// Fs (protocol/system/fs)
export type { Fs, FsEntry, FsContext, FsActions } from '@osprotocol/schema/system/fs'
export { createMemoryFs } from './system/fs'

// KV Store (protocol/context/kv)
export type { Kv, KvEntry, KvContext, KvActions } from './context/kv'
export { createMemoryKv, type MemoryKvOptions } from './context/kv'

// Note: Individual tools are available via direct imports:
// import { read } from '@syner/sdk/system/fs/tools'
// They are placeholders - use extensions like @syner/vercel for actual implementations

// Agents
export type { Agent, Annotations, Metadata } from './agents'

// Runs (protocol/runs/*)
// Import types from @osprotocol/schema
export type {
  RunOptions,
  RunStatus,
  Execution,
  ExecutionProgress,
  Timeout,
  TimeoutAction,
  Retry,
  Backoff,
  Cancel,
  Approval,
  ApprovalConfig,
  ApprovalRequest,
} from './runs'

// Workflow interface from protocol, ExecutionImpl from SDK
export type { Workflow, InferWorkflowOutput } from './runs'
export { ExecutionImpl } from './runs'

// Agents (meta-agents for orchestration)
export * as agents from './agents'

// Workflows (protocol/workflows/*)
export * as workflows from './workflows'
