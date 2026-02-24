/**
 * @syner/slack - Slack Integration
 *
 * Framework-agnostic Slack integration for Syner OS:
 * - Webhook handler with signature verification
 * - Client for chat, DMs, and assistant threads
 *
 * @example
 * ```ts
 * import { createHandler, createSlackClient, sendMessage, synerMd } from '@syner/slack'
 * import { syner } from 'syner'
 *
 * // Wire handler to your API route
 * export const POST = createHandler({
 *   signingSecret: process.env.SLACK_SIGNING_SECRET!,
 *   onAppMention: async (event) => {
 *     const client = createSlackClient({ botToken: process.env.SLACK_BOT_TOKEN! })
 *     const { text } = await syner.generate({ prompt: event.text, md: synerMd })
 *     await sendMessage(client, { channel: event.channel, text, threadTs: event.ts })
 *   },
 * })
 * ```
 */

// @ts-expect-error — raw .md import handled by tsup loader
import synerMdRaw from '../SYNER.md'

/** Slack-specific system prompt instructions */
export const synerMd: string = synerMdRaw

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
