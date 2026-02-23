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
import { think, card } from 'syner'
import {
  createGitHubAppClient,
  getFileContentTool,
  listDirectoryTool,
  getRepoInfoTool,
  searchCodeTool,
} from '@syner/github'
import { createUpstashKv } from '@syner/upstash'

const SLACK_SYSTEM_PROMPT = `You are ${card().name}, an AI assistant for Slack that understands what you need and coordinates tools and agents to get things done.

<identity>
${card().description}
</identity>

<instructions>
- Respond conversationally. You're in a chat, not writing a document.
- Be concise. Most messages should be 1-3 short paragraphs.
- Never show internal reasoning (no "Classifying request", "Strategy", headers).
- Use Slack formatting: *bold*, _italic_, \`code\`. No markdown headers.
- Match the user's language. Spanish → Spanish. English → English.
- Match the user's energy. Casual → casual. Technical → focused.
- If you don't know something, say so directly.
</instructions>

<examples>
<example>
<user>hola syner</user>
<response>Hola! En qué te puedo ayudar?</response>
</example>

<example>
<user>can you help me plan a migration from postgres to planetscale?</user>
<response>Sure — a few things to figure out first:

• *Schema compatibility*: PlanetScale uses Vitess, so no foreign keys. Do you rely on FKs?
• *Data volume*: How big is the DB? Affects migration strategy.
• *Downtime tolerance*: Maintenance window ok, or zero-downtime?

Once I know those, I can sketch a plan.</response>
</example>
</examples>`

function getSlackClient() {
  const botToken = process.env.SLACK_BOT_TOKEN
  if (!botToken) throw new Error('Missing SLACK_BOT_TOKEN')
  return createSlackClient({ botToken })
}

// Lazy-initialized clients (deferred until first request to avoid build-time errors)
let githubClient: ReturnType<typeof createGitHubAppClient> | null = null
let kv: ReturnType<typeof createUpstashKv> | null = null

function getGitHubClient() {
  if (!githubClient) {
    githubClient = createGitHubAppClient({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!,
      installationId: process.env.GITHUB_INSTALLATION_ID!,
    })
  }
  return githubClient
}

function getKv() {
  if (!kv) {
    kv = createUpstashKv()
  }
  return kv
}

function getTools() {
  const client = getGitHubClient()
  return {
    github_getFileContent: getFileContentTool({ client, kv: getKv() }),
    github_listDirectory: listDirectoryTool({ client }),
    github_getRepoInfo: getRepoInfoTool({ client }),
    github_searchCode: searchCodeTool({ client }),
  }
}

export const POST = createHandler({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  afterFn: after,
  onError: (error) => console.error('[slack webhook]', error),

  onAppMention: async (event) => {
    const client = getSlackClient()
    const channel = event.channel
    const threadTs = event.thread_ts ?? event.ts

    // Note: setAssistantStatus only works in assistant threads, not regular mentions

    const { text } = await think(event.text, {
      systemPrompt: SLACK_SYSTEM_PROMPT,
      tools: getTools(),
    })
    await replyInThread(client, { channel, threadTs, text })
  },

  onAssistantThreadStarted: async (event) => {
    const client = getSlackClient()
    const { channel_id, thread_ts } = event.assistant_thread

    await setAssistantStatus(client, {
      channelId: channel_id,
      threadTs: thread_ts,
      status: 'Thinking...',
    })

    const { text } = await think('A new conversation has started. Introduce yourself briefly.', {
      systemPrompt: SLACK_SYSTEM_PROMPT,
    })
    await replyInThread(client, { channel: channel_id, threadTs: thread_ts, text })
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
    const channel = event.channel
    const threadTs = event.thread_ts ?? event.ts

    // Try to set status, but don't fail if not an assistant thread
    try {
      await setAssistantStatus(client, { channelId: channel, threadTs, status: 'Thinking...' })
    } catch {
      // Not an assistant thread, ignore
    }

    const { text } = await think(event.text, {
      systemPrompt: SLACK_SYSTEM_PROMPT,
      tools: getTools(),
    })
    await replyInThread(client, { channel, threadTs, text })
  },
})
