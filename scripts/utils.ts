import path from 'node:path'

export const resolve = (...args: string[]) =>
  path.resolve(import.meta.dirname, '..', ...args)
