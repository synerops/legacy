/**
 * Extended Fs interfaces for SDK.
 *
 * Fs base comes from @osprotocol/schema.
 * FsStreaming extends it for drivers that handle large files.
 *
 * If this proves useful, propose to OSProtocol:
 * https://github.com/synerops/osprotocol/issues/new
 */

import type { Fs } from '@osprotocol/schema/system/fs'
import type { Readable } from 'stream'

// Re-export base interface
export type { Fs, FsEntry, FsContext, FsActions } from '@osprotocol/schema/system/fs'

/**
 * Legacy Filesystem interface for sandbox compatibility.
 *
 * Supports both Web API ReadableStream and Node.js Readable streams
 * to accommodate different sandbox implementations.
 *
 * @deprecated Use Fs from @osprotocol/schema instead
 */
export interface Filesystem {
  readFile: (
    path: string,
    signal?: AbortSignal
  ) => Promise<null | ReadableStream<any> | Readable>

  writeFiles: (
    files: Array<{ path: string; content: string }>,
    signal?: AbortSignal
  ) => Promise<void>
}

/**
 * Extended filesystem interface with streaming support.
 *
 * Drivers that handle large files (disk, s3, blob storage)
 * SHOULD implement this interface.
 *
 * Drivers for small data (inmemory, redis) only need Fs.
 */
export interface FsStreaming extends Fs {
  /**
   * Read file as a stream.
   * Use for large files to avoid memory pressure.
   *
   * @param path - File path
   * @param signal - AbortSignal to cancel the operation
   * @returns ReadableStream or null if file not found
   */
  readStream(path: string, signal?: AbortSignal): Promise<ReadableStream | null>

  /**
   * Get a writable stream for a file.
   * Use for large files or incremental writes.
   *
   * @param path - File path (created if doesn't exist)
   * @param signal - AbortSignal to cancel the operation
   * @returns WritableStream
   */
  writeStream(path: string, signal?: AbortSignal): Promise<WritableStream>
}

/**
 * Type guard to check if a filesystem supports streaming.
 *
 * @example
 * ```ts
 * if (isStreamable(fs)) {
 *   const stream = await fs.readStream('/large/file.log', signal)
 * }
 * ```
 */
export function isStreamable(fs: Fs): fs is FsStreaming {
  return 'readStream' in fs && 'writeStream' in fs
}
