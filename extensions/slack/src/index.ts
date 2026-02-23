/**
 * @syner/slack - Slack Integration
 *
 * Framework-agnostic Slack integration for Syner OS:
 * - Webhook handler with signature verification
 * - Client for chat, DMs, and assistant threads
 *
 * @example
 * ```ts
 * import { createHandler, createSlackClient, sendMessage } from '@syner/slack'
 *
 * // Wire handler to your API route
 * export const POST = createHandler({
 *   signingSecret: process.env.SLACK_SIGNING_SECRET!,
 *   onAppMention: async (event) => {
 *     const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })
 *     await sendMessage(client, { channel: event.channel, text: 'Hello!', threadTs: event.ts })
 *   },
 * })
 * ```
 */

// Handler
export { createHandler } from './handler'

// Client
export {
  createSlackClient,
  sendMessage,
  replyInThread,
  streamReply,
  setAssistantStatus,
  setAssistantTitle,
  setAssistantSuggestedPrompts,
  type SlackClient,
  type SendMessageOptions,
  type StreamReplyOptions,
  type SetAssistantStatusOptions,
  type SetAssistantTitleOptions,
  type SuggestedPrompt,
  type SetAssistantSuggestedPromptsOptions,
} from './client'

// Types
export type {
  SlackHandlerOptions,
  SlackClientOptions,
  SlackPayload,
  SlackUrlVerification,
  SlackEventCallback,
  SlackEvent,
  AppMentionEvent,
  AssistantThreadStartedEvent,
  AssistantThreadContextChangedEvent,
  AssistantThread,
  AssistantThreadContext,
  MessageEvent,
} from './types'
