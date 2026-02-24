/**
 * Memory Tool
 *
 * Persists execution context during agent runs.
 * Uses Fs from @osprotocol/schema as backend.
 */

import { tool } from 'ai'
import type { Fs } from '@osprotocol/schema/system/fs'
import { memorySchema, type MemoryInput } from './schema'

// @ts-expect-error — raw .md import handled by tsup loader
import instructionsMd from './instructions.md'
import matter from 'gray-matter'

const { data } = matter(instructionsMd)
const description = data.description as string

/**
 * Creates a memory tool bound to a session.
 *
 * @param fs - Filesystem implementation
 * @param sessionName - Session name for path scoping
 */
export function createMemoryTool(fs: Fs, sessionName: string) {
  const basePath = `/sessions/${sessionName}/memories`

  return tool({
    description,
    inputSchema: memorySchema,
    execute: async (input) => {
      const path = `${basePath}/${input.filename}`

      switch (input.command) {
        case 'view': {
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `File not found: ${input.filename}` }
          }
          return { success: true, content }
        }

        case 'create': {
          if (!input.content) {
            return { success: false, error: 'content is required for create' }
          }
          await fs.write(path, input.content)
          return { success: true, path, message: `Created ${input.filename}` }
        }

        case 'str_replace': {
          if (!input.old_str || input.new_str === undefined) {
            return { success: false, error: 'old_str and new_str are required for str_replace' }
          }
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `File not found: ${input.filename}` }
          }
          if (!content.includes(input.old_str)) {
            return { success: false, error: `Text not found: "${input.old_str}"` }
          }
          const newContent = content.replace(input.old_str, input.new_str)
          await fs.write(path, newContent)
          return { success: true, path, message: `Updated ${input.filename}` }
        }

        case 'insert': {
          if (input.insert_line === undefined || input.new_str === undefined) {
            return { success: false, error: 'insert_line and new_str are required for insert' }
          }
          const content = await fs.read(path)
          if (content === null) {
            return { success: false, error: `File not found: ${input.filename}` }
          }
          const lines = content.split('\n')
          const insertIndex = Math.min(input.insert_line, lines.length)
          lines.splice(insertIndex, 0, input.new_str)
          const newContent = lines.join('\n')
          await fs.write(path, newContent)
          return {
            success: true,
            path,
            message: `Inserted at line ${input.insert_line} in ${input.filename}`,
          }
        }

        case 'delete': {
          const existed = await fs.remove(path)
          if (!existed) {
            return { success: false, error: `File not found: ${input.filename}` }
          }
          return { success: true, message: `Deleted ${input.filename}` }
        }
      }
    },
  })
}

export { memorySchema, type MemoryInput }
