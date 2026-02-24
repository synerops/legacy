/**
 * Filesystem security utilities
 */

import { realpath } from 'fs/promises'
import { resolve, dirname, normalize } from 'path'
import { randomBytes } from 'crypto'
import { writeFile, rename, unlink } from 'fs/promises'

/**
 * Normalize path for consistent comparison
 */
export function normalizePath(p: string): string {
  return normalize(p).toLowerCase()
}

/**
 * Check if path is within allowed root directory
 */
export function isWithinRoot(targetPath: string, root: string): boolean {
  const normalizedTarget = normalizePath(resolve(targetPath))
  const normalizedRoot = normalizePath(resolve(root))

  // Use startsWith for directory containment check
  return (
    normalizedTarget === normalizedRoot ||
    normalizedTarget.startsWith(normalizedRoot + '/')
  )
}

/**
 * Validate path is safe to access.
 * - Prevents path traversal
 * - Validates symlink targets
 * - Checks null byte injection
 *
 * @param requestedPath - Path relative to root
 * @param root - Root directory (e.g., .syner/)
 * @returns Resolved absolute path
 */
export async function validatePath(
  requestedPath: string,
  root: string
): Promise<string> {
  // Null byte injection check
  if (requestedPath.includes('\0')) {
    throw new Error('Invalid path: contains null byte')
  }

  // Normalize input path
  const normalized = requestedPath.startsWith('/')
    ? requestedPath.slice(1)
    : requestedPath

  const absolute = resolve(root, normalized)

  // Check path is within root before any file operations
  if (!isWithinRoot(absolute, root)) {
    throw new Error(`Access denied - path outside root: ${requestedPath}`)
  }

  // Handle symlinks by checking their real path
  try {
    const realPath = await realpath(absolute)
    if (!isWithinRoot(realPath, root)) {
      throw new Error(
        `Access denied - symlink target outside root: ${realPath}`
      )
    }
    return realPath
  } catch (error: any) {
    // For new files that don't exist, verify parent directory
    if (error.code === 'ENOENT') {
      const parentDir = dirname(absolute)
      try {
        const realParentPath = await realpath(parentDir)
        if (!isWithinRoot(realParentPath, root)) {
          throw new Error(
            `Access denied - parent outside root: ${realParentPath}`
          )
        }
      } catch {
        // Parent doesn't exist, will be created - that's OK
      }
      return absolute
    }
    throw error
  }
}

/**
 * Atomic write to prevent race conditions.
 * Uses temp file + rename pattern.
 */
export async function atomicWrite(
  filePath: string,
  content: string
): Promise<void> {
  const tempPath = `${filePath}.${randomBytes(16).toString('hex')}.tmp`
  try {
    await writeFile(tempPath, content, 'utf-8')
    await rename(tempPath, filePath)
  } catch (error) {
    try {
      await unlink(tempPath)
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}
