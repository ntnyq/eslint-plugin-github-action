import { expect, it } from 'vitest'
import { plugin } from '../src'

it('should meta valid', () => {
  expect(plugin.meta.name).toMatchInlineSnapshot(
    `"eslint-plugin-github-action"`,
  )
  expect(plugin.meta).toHaveProperty(['version'])
})
