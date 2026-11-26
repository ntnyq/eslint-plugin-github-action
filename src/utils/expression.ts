/**
 * Checks for an expression opener, including interpolation and malformed expressions.
 * @param value - String to inspect without evaluating expressions.
 * @returns Whether the string contains an expression opener.
 */
export function hasExpression(value: string): boolean {
  return value.includes('${{')
}

/**
 * Finds the end of the expression that opens at an index.
 * Quoted expression strings may contain closing delimiters and escaped quotes.
 *
 * @param value - String containing the expression.
 * @param start - Index of the expression opener `${{`.
 * @returns Index just after the closing `}}`, or -1 when the expression is unclosed.
 */
export function findExpressionEnd(value: string, start: number): number {
  let inString = false
  for (let index = start + 3; index < value.length; index++) {
    if (value[index] === "'") {
      if (inString && value[index + 1] === "'") {
        index++
      } else {
        inString = !inString
      }
    } else if (!inString && value.startsWith('}}', index)) {
      return index + 2
    }
  }
  return -1
}

/**
 * Checks whether a value consists of one complete GitHub Actions expression.
 * Quoted expression strings may contain closing delimiters and escaped quotes.
 *
 * @param value - String to inspect without evaluating its expression.
 * @returns Whether there is a non-empty expression with no surrounding text.
 */
export function isSingleExpression(value: string): boolean {
  const source = value.trim()
  if (!source.startsWith('${{')) {
    return false
  }
  const end = findExpressionEnd(source, 0)
  return end === source.length && source.slice(3, end - 2).trim().length > 0
}
