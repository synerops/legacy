/**
 * AI SDK to MCP Tool Adapter
 *
 * Converts AI SDK tools to MCP tool registration format.
 * Uses AI SDK's asSchema() for FlexibleSchema → JSON Schema conversion.
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool as McpTool,
} from '@modelcontextprotocol/sdk/types.js'
import { asSchema, type Tool } from 'ai'

/**
 * Registered tool with MCP definition and execute function.
 */
interface RegisteredTool {
  definition: McpTool
  execute: (input: unknown) => Promise<unknown>
}

/**
 * Creates a tool registry that can register AI SDK tools and set up MCP handlers.
 */
export function createToolRegistry() {
  const tools = new Map<string, RegisteredTool>()

  return {
    /**
     * Register an AI SDK tool for MCP exposure.
     *
     * @param name - MCP tool name (e.g., 'github_createPullRequest')
     * @param tool - AI SDK tool created with `tool()` from 'ai' package
     */
    async register(name: string, tool: Tool): Promise<void> {
      // Use AI SDK's asSchema to convert FlexibleSchema → Schema with jsonSchema
      const schema = asSchema(tool.inputSchema)
      const jsonSchema = await schema.jsonSchema

      tools.set(name, {
        definition: {
          name,
          description: tool.description ?? `Tool: ${name}`,
          inputSchema: jsonSchema as McpTool['inputSchema'],
        },
        execute: (input: unknown) => {
          if (tool.execute) {
            return Promise.resolve(tool.execute(input as never, {} as never))
          }
          return Promise.resolve({ error: 'Tool has no execute function' })
        },
      })
    },

    /**
     * Set up MCP request handlers on the server.
     */
    setupHandlers(server: Server): void {
      // List available tools
      server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: Array.from(tools.values()).map((t) => t.definition),
      }))

      // Handle tool calls
      server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params
        const tool = tools.get(name)

        if (!tool) {
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          }
        }

        try {
          const result = await tool.execute(args ?? {})
          const text =
            typeof result === 'string' ? result : JSON.stringify(result, null, 2)

          return {
            content: [{ type: 'text', text }],
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
          }
        }
      })
    },
  }
}
