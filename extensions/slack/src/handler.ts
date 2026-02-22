/**
 * Slack Webhook Handler
 *
 * Framework-agnostic handler using Web API Request/Response.
 * Verifies request signatures, handles url_verification,
 * and dispatches events to callbacks.
 *
 * @example
 * ```ts
 * // Next.js API route (one-liner)
 * import { createHandler } from '@syner/slack'
 *
 * export const POST = createHandler({
 *   signingSecret: process.env.SLACK_SIGNING_SECRET!,
 *   onAppMention: async (event) => { ... },
 *   onAssistantThreadStarted: async (event) => { ... },
 * })
 *
 * // Any framework
 * const handler = createHandler({ signingSecret: '...' })
 * const response = await handler(request)
 * ```
 *
 * Note: The handler returns 200 immediately to meet Slack's
 * 3-second deadline. Pass `afterFn` (e.g. Next.js `after`) to
 * keep the serverless function alive for async work. Without
 * `afterFn`, dispatch runs as fire-and-forget.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import type {
  SlackHandlerOptions,
  SlackPayload,
  SlackEventCallback,
  AppMentionEvent,
  AssistantThreadStartedEvent,
  AssistantThreadContextChangedEvent,
  MessageEvent,
} from './types'

/** Maximum age of a request timestamp (5 minutes) */
const MAX_TIMESTAMP_AGE_S = 300

/**
 * Verifies a Slack request signature.
 *
 * @see https://api.slack.com/authentication/verifying-requests-from-slack
 */
function verifySignature(
  headers: Headers,
  body: string,
  signingSecret: string
): boolean {
  const timestamp = headers.get('x-slack-request-timestamp')
  const signature = headers.get('x-slack-signature')

  if (!timestamp || !signature) return false

  // Reject requests older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000)
  const ts = Number(timestamp)
  if (Number.isNaN(ts) || Math.abs(now - ts) > MAX_TIMESTAMP_AGE_S) return false

  // Compute expected signature: v0=sha256(v0:timestamp:body)
  const baseString = `v0:${timestamp}:${body}`
  const expected = `v0=${createHmac('sha256', signingSecret).update(baseString).digest('hex')}`

  // Timing-safe comparison
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

/**
 * Creates a framework-agnostic Slack webhook handler.
 *
 * Returns an async function that takes a Web API Request
 * and returns a Web API Response. Wire it directly to your
 * API route — no framework glue needed.
 */
export function createHandler(options: SlackHandlerOptions) {
  const { signingSecret } = options

  return async (req: Request): Promise<Response> => {
    // Only accept POST
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const body = await req.text()

    // Verify request authenticity
    if (!verifySignature(req.headers, body, signingSecret)) {
      return new Response('Unauthorized', { status: 401 })
    }

    let payload: SlackPayload
    try {
      payload = JSON.parse(body) as SlackPayload
    } catch {
      return new Response('Bad Request', { status: 400 })
    }

    // URL verification challenge (Slack app setup)
    if (payload.type === 'url_verification') {
      return new Response(JSON.stringify({ challenge: payload.challenge }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Event callback — respond 200 immediately to meet Slack's 3-second deadline.
    // If afterFn is provided, use it to keep serverless function alive.
    // Otherwise, fire-and-forget.
    if (payload.type === 'event_callback') {
      const handle = () =>
        dispatch(options, payload).catch((error) => { options.onError?.(error) })

      if (options.afterFn) {
        options.afterFn(handle)
      } else {
        handle()
      }
    }

    return new Response('ok', { status: 200 })
  }
}

/**
 * Dispatches a Slack event to the appropriate callback.
 */
async function dispatch(
  options: SlackHandlerOptions,
  envelope: SlackEventCallback
): Promise<void> {
  const { event } = envelope

  switch (event.type) {
    case 'app_mention':
      await options.onAppMention?.(event as AppMentionEvent, envelope as SlackEventCallback<AppMentionEvent>)
      break

    case 'assistant_thread_started':
      await options.onAssistantThreadStarted?.(
        event as AssistantThreadStartedEvent,
        envelope as SlackEventCallback<AssistantThreadStartedEvent>
      )
      break

    case 'assistant_thread_context_changed':
      await options.onAssistantThreadContextChanged?.(
        event as AssistantThreadContextChangedEvent,
        envelope as SlackEventCallback<AssistantThreadContextChangedEvent>
      )
      break

    case 'message': {
      const msg = event as MessageEvent
      // Skip bot-originated messages to prevent echo loops
      if (msg.bot_id || msg.subtype === 'bot_message') break
      await options.onMessage?.(msg, envelope as SlackEventCallback<MessageEvent>)
      break
    }
  }
}
