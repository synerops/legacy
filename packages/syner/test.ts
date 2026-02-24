/**
 * Test script for Syner orchestration
 *
 * Usage:
 *   echo "hola que tal" | bun packages/syner/test.ts
 *   echo "crea un archivo en src/" | bun packages/syner/test.ts
 */

import { syner } from './src'

const prompt = await Bun.stdin.text()

if (!prompt.trim()) {
  console.error('Usage: echo "tu prompt" | bun packages/syner/test.ts')
  process.exit(1)
}

console.log(`Input: "${prompt.trim()}"`)
console.log('---')

const result = await syner.ask(prompt.trim())

console.log('Result:')
console.log(result.text)
