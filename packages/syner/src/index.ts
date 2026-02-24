/**
 * Syner - The Orchestrator Agent of Syner OS
 *
 * Provides the Syner class and singleton for AI-powered orchestration.
 */

export {
  // Main exports
  syner,
  Syner,
  models,
  // Types
  type AgentCard,
  type GenerateOptions,
  type GenerateResponse,
  type StreamOptions,
  type StreamResponse,
} from './brain'

// Re-export prompts utilities
export { instructions } from './prompts'
