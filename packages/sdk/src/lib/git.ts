/**
 * Git utilities
 */

import { existsSync, lstatSync, readFileSync } from 'fs'
import { join, dirname, parse } from 'path'

/**
 * Find the root directory of a git repository.
 * Handles worktrees where .git is a file.
 *
 * @param start - Directory to start searching from (default: process.cwd())
 * @returns The git root directory or null if not found
 */
export function findGitRoot(start: string = process.cwd()): string | null {
  let dir = start

  while (dir !== parse(dir).root) {
    const gitPath = join(dir, '.git')

    if (existsSync(gitPath)) {
      // Worktree: .git is a file, not directory
      if (!lstatSync(gitPath).isDirectory()) {
        const content = readFileSync(gitPath, 'utf-8')
        const match = /^gitdir: (.*)$/m.exec(content)
        if (match) {
          return dir // Return worktree root, not gitdir
        }
      }
      return dir
    }

    dir = dirname(dir)
  }

  return null
}
