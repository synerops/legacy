/**
 * Filesystem module exports
 */

// Protocol interfaces
export type { Filesystem, FsStreaming } from './protocol'
export { isStreamable } from './protocol'

// Re-export OSP types for convenience
export type { Fs, FsEntry, FsContext, FsActions } from '@osprotocol/schema/system/fs'

// Drivers
export {
  createDiskFs,
  createInMemoryFs,
  createMemoryFs,
  type DiskFsOptions,
} from './drivers'

// Tool factory
export { createFsTools } from './tools'

// Individual tool factories
export {
  createReadTool,
  createWriteTool,
  createListTool,
  createRemoveTool,
  createExistsTool,
} from './tools'

// Placeholder tools (deprecated - use createFsTools instead)
// Available via: import { read, write, list } from '@syner/sdk/system/fs/tools'
