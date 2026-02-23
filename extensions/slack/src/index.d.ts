/**
 * @syner/slack type declarations
 *
 * Event types re-exported from ./types (single source of truth).
 * Function signatures and client-only types declared inline
 * since tsup dts is disabled.
 */

import type { WebClient } from '@slack/web-api'

// ============================================================================
// Event Types (from ./types — do NOT redeclare here)
// ============================================================================

export type {
  SlackUrlVerification,
  SlackEventCallback,
  SlackPayload,
  SlackEvent,
  AppMentionEvent,
  AssistantThreadStartedEvent,
  AssistantThreadContextChangedEvent,
  AssistantThread,
  AssistantThreadContext,
  MessageEvent,
  SlackHandlerOptions,
  SlackClientOptions,
  StreamReplyOptions,
} from './types'

// ============================================================================
// Handler
// ============================================================================

import type { SlackHandlerOptions } from './types'

export declare function createHandler(
  options: SlackHandlerOptions
): (req: Request) => Promise<Response>

// ============================================================================
// Client
// ============================================================================

export type SlackClient = WebClient

export declare function createSlackClient(
  options: import('./types').SlackClientOptions
): SlackClient

export interface SendMessageOptions {
  channel: string
  text: string
  threadTs?: string
  mrkdwn?: boolean
}

export declare function sendMessage(
  client: SlackClient,
  options: SendMessageOptions
): Promise<unknown>

export declare function replyInThread(
  client: SlackClient,
  options: { channel: string; threadTs: string; text: string }
): Promise<unknown>

export interface SetAssistantStatusOptions {
  channelId: string
  threadTs: string
  status: string
}

export declare function setAssistantStatus(
  client: SlackClient,
  options: SetAssistantStatusOptions
): Promise<unknown>

export interface SetAssistantTitleOptions {
  channelId: string
  threadTs: string
  title: string
}

export declare function setAssistantTitle(
  client: SlackClient,
  options: SetAssistantTitleOptions
): Promise<unknown>

export interface SuggestedPrompt {
  title: string
  message: string
}

export interface SetAssistantSuggestedPromptsOptions {
  channelId: string
  threadTs: string
  prompts: SuggestedPrompt[]
}

export declare function setAssistantSuggestedPrompts(
  client: SlackClient,
  options: SetAssistantSuggestedPromptsOptions
): Promise<unknown>

export declare function streamReply(
  client: SlackClient,
  options: import('./types').StreamReplyOptions
): Promise<{ text: string }>
