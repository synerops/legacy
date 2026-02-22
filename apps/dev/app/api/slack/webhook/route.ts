/**
 * Slack Webhook Route
 *
 * POST /api/slack/webhook
 *
 * Receives all Slack events (mentions, assistant threads, DMs).
 * The handler from @syner/slack does verification and dispatch —
 * this route just wires it up.
 *
 * `afterFn` keeps the serverless function alive after the 200
 * response is sent to Slack.
 */

import { after } from 'next/server'
import { createHandler, createSlackClient, replyInThread, setAssistantStatus } from '@syner/slack'

function getSlackClient() {
  const botToken = process.env.SLACK_BOT_TOKEN
  if (!botToken) throw new Error('Missing SLACK_BOT_TOKEN')
  return createSlackClient({ botToken })
}

export const POST = createHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onError: (error) => console.error('[slack webhook]', error),

  onAppMention: async (event) => {
    const client = getSlackClient()
    await replyInThread(client, {
      channel: event.channel,
      threadTs: event.thread_ts ?? event.ts,
      text: `👋 Got your mention! (syner v0)`,
    })
  },

  onAssistantThreadStarted: async (event) => {
    const client = getSlackClient()
    const { channel_id, thread_ts } = event.assistant_thread
    await setAssistantStatus(client, {
      channelId: channel_id,
      threadTs: thread_ts,
      status: 'Thinking...',
    })
    await replyInThread(client, {
      channel: channel_id,
      threadTs: thread_ts,
      text: "Hello! I'm Syner. How can I help?",
    })
  },

  onAssistantThreadContextChanged: async (event) => {
    const client = getSlackClient()
    const { channel_id, thread_ts, context } = event.assistant_thread
    await replyInThread(client, {
      channel: channel_id,
      threadTs: thread_ts,
      text: `Context switched to <#${context.channel_id}>`,
    })
  },

  onMessage: async (event) => {
    const client = getSlackClient()
    await replyInThread(client, {
      channel: event.channel,
      threadTs: event.thread_ts ?? event.ts,
      text: `Echo: ${event.text}`,
    })
  },
})
