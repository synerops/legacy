/**
 * In-Memory Fs Implementation
 *
 * Simple in-memory implementation of the OSP Fs interface.
 * Useful for development, testing, and session-scoped storage.
 */

import type { Fs, FsEntry } from '@osprotocol/schema/system/fs'

/**
 * Creates an in-memory filesystem.
 *
 * @example
 * ```ts
 * const fs = createInMemoryFs()
 *
 * await fs.write('/sessions/auth-feature/plans/initial.md', '# Plan\n...')
 * const content = await fs.read('/sessions/auth-feature/plans/initial.md')
 * ```
 */
export function createInMemoryFs(): Fs {
  const files = new Map<string, { content: string; updatedAt: number }>()

  return {
    async read(path: string): Promise<string | null> {
      const entry = files.get(path)
      return entry?.content ?? null
    },

    async write(path: string, content: string): Promise<FsEntry> {
      const now = Date.now()
      files.set(path, { content, updatedAt: now })

      const name = path.split('/').pop() ?? path

      return {
        name,
        path,
        type: 'file',
        size: content.length,
        updatedAt: now,
      }
    },

    async remove(path: string): Promise<boolean> {
      // Remove exact match
      if (files.has(path)) {
        files.delete(path)
        return true
      }

      // Remove directory (all files under path/)
      const prefix = path.endsWith('/') ? path : `${path}/`
      let removed = false

      for (const key of files.keys()) {
        if (key.startsWith(prefix)) {
          files.delete(key)
          removed = true
        }
      }

      return removed
    },

    async list(path: string): Promise<FsEntry[]> {
      const normalizedPath = path.endsWith('/') ? path : `${path}/`
      const entries: FsEntry[] = []
      const seenDirs = new Set<string>()

      for (const [filePath, data] of files.entries()) {
        if (!filePath.startsWith(normalizedPath)) continue

        const relativePath = filePath.slice(normalizedPath.length)
        const parts = relativePath.split('/')
        const firstName = parts[0]

        if (!firstName) continue

        if (parts.length === 1) {
          // Direct file in this directory
          entries.push({
            name: firstName,
            path: filePath,
            type: 'file',
            size: data.content.length,
            updatedAt: data.updatedAt,
          })
        } else {
          // Subdirectory
          if (!seenDirs.has(firstName)) {
            seenDirs.add(firstName)
            entries.push({
              name: firstName,
              path: `${normalizedPath}${firstName}`,
              type: 'directory',
            })
          }
        }
      }

      return entries
    },

    async exists(path: string): Promise<boolean> {
      // Check exact file match
      if (files.has(path)) return true

      // Check if it's a directory (has files under it)
      const prefix = path.endsWith('/') ? path : `${path}/`
      for (const key of files.keys()) {
        if (key.startsWith(prefix)) return true
      }

      return false
    },
  }
}

/**
 * @deprecated Use createInMemoryFs instead
 */
export const createMemoryFs = createInMemoryFs
