import path from 'node:path'

export const resolveProjectPath = (...args: string[]) =>
  path.resolve(import.meta.dirname, '..', ...args)
