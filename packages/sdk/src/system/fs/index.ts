/**
 * Filesystem module exports
 */

export type { Filesystem } from './protocol'

// OSP Fs interface implementation
export { createMemoryFs } from './memory'

// Tools are available via import { read, write, list } from '@syner/sdk/system/fs/tools'
// They are placeholders - use extensions like @syner/vercel for actual implementations
