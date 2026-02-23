/**
 * Slack Event Types
 *
 * Type definitions for Slack Events API payloads.
 * Covers: app_mention, assistant threads, and direct messages.
 */

// ============================================================================
// Event Envelope
// ============================================================================

export interface SlackUrlVerification {
  type: 'url_verification'
  token: string
  challenge: string
}

export interface SlackEventCallback<E = SlackEvent> {
  type: 'event_callback'
  token: string
  team_id: string
  api_app_id: string
  event: E
  event_id: string
  event_time: number
}

export type SlackPayload = SlackUrlVerification | SlackEventCallback

// ============================================================================
// Events
// ============================================================================

export interface AppMentionEvent {
  type: 'app_mention'
  user: string
  text: string
  ts: string
  channel: string
  event_ts: string
  thread_ts?: string
}

export interface AssistantThreadContext {
  channel_id: string
  team_id: string
  enterprise_id?: string
}

export interface AssistantThread {
  user_id: string
  context: AssistantThreadContext
  channel_id: string
  thread_ts: string
}

export interface AssistantThreadStartedEvent {
  type: 'assistant_thread_started'
  assistant_thread: AssistantThread
}

export interface AssistantThreadContextChangedEvent {
  type: 'assistant_thread_context_changed'
  assistant_thread: AssistantThread
}

export interface MessageEvent {
  type: 'message'
  channel: string
  user: string
  text: string
  ts: string
  thread_ts?: string
  channel_type: 'im' | 'channel' | 'group' | 'mpim'
  subtype?: string
  bot_id?: string
}

export type SlackEvent =
  | AppMentionEvent
  | AssistantThreadStartedEvent
  | AssistantThreadContextChangedEvent
  | MessageEvent

// ============================================================================
// Handler Options
// ============================================================================

export interface SlackHandlerOptions {
  /** Slack app signing secret for request verification */
  signingSecret: string

  /** Called when an event dispatch throws. Defaults to silent. */
  onError?: (error: unknown) => void

  /**
   * Schedules work after the response is sent.
   * Next.js: pass `after` from 'next/server'.
   * Cloudflare: wrap `ctx.waitUntil()`.
   * If omitted, dispatch runs as fire-and-forget.
   */
  afterFn?: (callback: () => Promise<void>) => void

  /** Called when the bot is @mentioned in a channel */
  onAppMention?: (event: AppMentionEvent, envelope: SlackEventCallback<AppMentionEvent>) => Promise<void>

  /** Called when a user opens a new assistant thread */
  onAssistantThreadStarted?: (
    event: AssistantThreadStartedEvent,
    envelope: SlackEventCallback<AssistantThreadStartedEvent>
  ) => Promise<void>

  /** Called when the user's channel context changes during an assistant thread */
  onAssistantThreadContextChanged?: (
    event: AssistantThreadContextChangedEvent,
    envelope: SlackEventCallback<AssistantThreadContextChangedEvent>
  ) => Promise<void>

  /** Called when a direct message is received */
  onMessage?: (event: MessageEvent, envelope: SlackEventCallback<MessageEvent>) => Promise<void>
}

// ============================================================================
// Client Options
// ============================================================================

export interface SlackClientOptions {
  /** Bot User OAuth Token (xoxb-...) */
  botToken: string
}

// ============================================================================
// Streaming
// ============================================================================

export interface StreamReplyOptions {
  /** Channel ID */
  channel: string
  /** Parent thread timestamp (streaming only works in threads) */
  threadTs: string
  /** Team ID of the recipient (required in channels, optional in DMs) */
  teamId?: string
  /** User ID of the recipient (required in channels, optional in DMs) */
  userId?: string
  /** Async iterable of text deltas (e.g. from AI SDK streamText().textStream) */
  textStream: AsyncIterable<string>
}
