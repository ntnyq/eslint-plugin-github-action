/**
 * resolve rule options
 *
 * @param options - context.options
 * @param defaultOptions - default options
 * @returns - resolved options
 */
export function resolveOptions<T>(options?: [T], defaultOptions?: T) {
  return (options?.[0] || defaultOptions) as T
}
