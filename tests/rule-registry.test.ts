import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'tinyglobby'
import { describe, expect, it } from 'vitest'
import { resolveProjectPath } from '../scripts/paths'
import { configs, rules } from '../src'

const ruleNames = Object.keys(rules).sort()

describe('rule registry', () => {
  it.each([
    { label: 'implementation', pattern: 'src/rules/*.ts', suffix: '.ts' },
    { label: 'test', pattern: 'tests/rules/*.test.ts', suffix: '.test.ts' },
    { label: 'documentation', pattern: 'docs/rules/*.md', suffix: '.md' },
  ])(
    'registers every rule with a matching $label file',
    async ({ pattern, suffix }) => {
      const files = await glob(pattern, { cwd: resolveProjectPath() })
      const names = files
        .map(file => path.basename(file, suffix))
        .filter(name => name !== 'index')
        .sort()

      expect(names).toEqual(ruleNames)
    },
  )

  it('lists every registered rule in the documentation index', async () => {
    const index = await readFile(
      resolveProjectPath('docs/rules/index.md'),
      'utf8',
    )
    const names = Array.from(
      index.matchAll(/\[([\w-]+)\]\(\.\/[\w-]+\)/gu),
      match => match[1],
    ).sort()

    expect(names).toEqual(ruleNames)
  })

  it('references only registered rules in presets', () => {
    const names = ruleNames.map(name => `github-action/${name}`)
    for (const preset of Object.values(configs)) {
      for (const config of preset) {
        for (const name of Object.keys(config.rules ?? {})) {
          expect(names).toContain(name)
        }
      }
    }
  })
})
