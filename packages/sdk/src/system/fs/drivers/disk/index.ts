/**
 * Disk filesystem driver
 *
 * Persists files to the local filesystem with security guarantees.
 */

import { mkdir, readFile, rm, readdir, stat } from 'fs/promises'
import { createReadStream, createWriteStream } from 'fs'
import { join, dirname, resolve } from 'path'
import { Readable, Writable } from 'stream'
import type { FsEntry } from '@osprotocol/schema/system/fs'
import type { FsStreaming } from '../../protocol'
import { validatePath, atomicWrite } from './security'

export interface DiskFsOptions {
  /** Base directory for all operations (e.g., '/path/to/repo/.syner') */
  root: string
}

/**
 * Creates a local filesystem that persists to disk.
 *
 * Implements FsStreaming for large file support.
 *
 * Security:
 * - Path traversal prevention
 * - Symlink target validation
 * - Atomic writes to prevent race conditions
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '/path/to/repo/.syner' })
 * await fs.write('/sessions/auth/context.md', content)
 * ```
 */
export function createDiskFs(options: DiskFsOptions): FsStreaming {
  const { root } = options
  const absoluteRoot = resolve(root)

  return {
    async read(path: string): Promise<string | null> {
      try {
        const fullPath = await validatePath(path, absoluteRoot)
        return await readFile(fullPath, 'utf-8')
      } catch (err: any) {
        if (err.code === 'ENOENT') return null
        throw err
      }
    },

    async write(path: string, content: string): Promise<FsEntry> {
      const fullPath = await validatePath(path, absoluteRoot)
      const dir = dirname(fullPath)

      await mkdir(dir, { recursive: true })
      await atomicWrite(fullPath, content)

      const stats = await stat(fullPath)
      const name = path.split('/').pop() ?? path

      return {
        name,
        path,
        type: 'file',
        size: stats.size,
        updatedAt: stats.mtimeMs,
      }
    },

    async remove(path: string): Promise<boolean> {
      try {
        const fullPath = await validatePath(path, absoluteRoot)
        await rm(fullPath, { recursive: true })
        return true
      } catch (err: any) {
        if (err.code === 'ENOENT') return false
        throw err
      }
    },

    async list(path: string): Promise<FsEntry[]> {
      try {
        const fullPath = await validatePath(path, absoluteRoot)
        const entries = await readdir(fullPath, { withFileTypes: true })

        return Promise.all(
          entries.map(async (entry) => {
            const entryPath = join(path, entry.name)
            const fullEntryPath = join(fullPath, entry.name)

            if (entry.isDirectory()) {
              return {
                name: entry.name,
                path: entryPath,
                type: 'directory' as const,
              }
            }

            const stats = await stat(fullEntryPath)
            return {
              name: entry.name,
              path: entryPath,
              type: 'file' as const,
              size: stats.size,
              updatedAt: stats.mtimeMs,
            }
          })
        )
      } catch (err: any) {
        if (err.code === 'ENOENT') return []
        throw err
      }
    },

    async exists(path: string): Promise<boolean> {
      try {
        const fullPath = await validatePath(path, absoluteRoot)
        await stat(fullPath)
        return true
      } catch {
        return false
      }
    },

    // FsStreaming methods

    async readStream(
      path: string,
      signal?: AbortSignal
    ): Promise<ReadableStream | null> {
      try {
        const fullPath = await validatePath(path, absoluteRoot)
        await stat(fullPath) // Check exists

        const nodeStream = createReadStream(fullPath, { signal })
        return Readable.toWeb(nodeStream) as ReadableStream
      } catch (err: any) {
        if (err.code === 'ENOENT') return null
        throw err
      }
    },

    async writeStream(
      path: string,
      signal?: AbortSignal
    ): Promise<WritableStream> {
      const fullPath = await validatePath(path, absoluteRoot)
      const dir = dirname(fullPath)
      await mkdir(dir, { recursive: true })

      const nodeStream = createWriteStream(fullPath, { signal })
      return Writable.toWeb(nodeStream) as WritableStream
    },
  }
}
