/**
 * @file Casing utils
 */

import {
  camelCase,
  capitalCase,
  kebabCase,
  pascalCase,
  snakeCase,
  trainCase,
} from 'uncase'
import { findExpressionEnd } from './expression'

export const CASING = {
  camelCase: 'camelCase',
  kebabCase: 'kebab-case',
  pascalCase: 'PascalCase',
  snakeCase: 'snake_case',
  titleCase: 'Title Case',
  trainCase: 'Train-Case',
  screamingSnakeCase: 'SCREAMING_SNAKE_CASE',
} as const

export type CasingKind =
  | 'camelCase'
  | 'kebab-case'
  | 'PascalCase'
  | 'snake_case'
  | 'Title Case'
  | 'Train-Case'
  | 'SCREAMING_SNAKE_CASE'

/**
 * Options for converting display names.
 */
export interface CasingOptions {
  /**
   * Whether minor words, except the first word, may stay lowercase in Title Case.
   */
  allowLowercaseMinorWords?: boolean
}

/**
 * Minor words that may stay lowercase in Title Case, matching the `title-case` package.
 */
export const MINOR_WORDS: ReadonlySet<string> = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'because',
  'but',
  'by',
  'en',
  'for',
  'if',
  'in',
  'neither',
  'nor',
  'of',
  'on',
  'only',
  'or',
  'over',
  'per',
  'so',
  'some',
  'than',
  'that',
  'the',
  'to',
  'up',
  'upon',
  'v',
  'versus',
  'via',
  'vs',
  'when',
  'with',
  'without',
  'yet',
])

/**
 * Placeholder for an expression or code span while converting a name.
 */
const OPAQUE = '\u{E000}'

/**
 * Replaces `${{ … }}` expressions and backtick code spans with placeholders.
 * An unclosed expression extends to the end; an unclosed backtick is literal.
 *
 * @param value - Name to mask.
 * @returns The masked name and the replaced spans in source order.
 */
export function maskOpaqueSpans(value: string) {
  const spans: string[] = []
  let masked = ''
  let index = 0
  while (index < value.length) {
    let end = -1
    if (value.startsWith('${{', index)) {
      end = findExpressionEnd(value, index)
      if (end === -1) {
        end = value.length
      }
    } else if (value[index] === '`') {
      const close = value.indexOf('`', index + 1)
      if (close !== -1) {
        end = close + 1
      }
    }
    if (end === -1) {
      masked += value[index]
      index++
    } else {
      spans.push(value.slice(index, end))
      masked += OPAQUE
      index = end
    }
  }
  return {
    masked,
    spans,
  }
}

/**
 * Checks whether a name contains an expression or a backtick code span.
 *
 * @param value - Name to inspect.
 * @returns Whether converting the name must preserve opaque spans.
 */
export function hasOpaqueSpan(value: string): boolean {
  return maskOpaqueSpans(value).spans.length > 0
}

/**
 * Matches a single identifier-like word: one containing `-` or `_`, or a
 * lowercase letter followed by an uppercase letter.
 */
const IDENTIFIER_RE = /^(?=.*(?:[-_]|\p{Ll}\p{Lu}))[\p{L}\p{N}_-]+$/u

/**
 * Leading characters of a word that precede its first letter or digit.
 */
const LEADING_RE = /^[^\p{L}\p{N}\u{E000}]*/u

/**
 * Converts a name to Title Case.
 *
 * A single identifier-like word, such as `unit_test` or `unitTest`, is split
 * into words, and a name without letters, digits, expressions, or code spans
 * converts to an empty string. Otherwise only the first letter of each
 * whitespace-separated word can change, preserving punctuation, acronyms,
 * expressions, and code spans; surrounding whitespace is removed.
 *
 * @param value - Name to convert.
 * @param options - Conversion options.
 * @returns The Title Case name.
 */
export function titleCase(value: string, options: CasingOptions = {}) {
  const { masked, spans } = maskOpaqueSpans(value.trim())
  if (
    IDENTIFIER_RE.test(masked) ||
    (spans.length === 0 && !/[\p{L}\p{N}]/u.test(masked))
  ) {
    return capitalCase(value)
  }
  let isFirstWord = true
  const converted = masked.replace(/\S+/gu, word => {
    const isFirst = isFirstWord
    isFirstWord = false
    const leading = LEADING_RE.exec(word)![0]
    const initial = word.charAt(leading.length)
    if (initial.toLowerCase() === initial.toUpperCase()) {
      return word
    }
    if (
      !isFirst &&
      options.allowLowercaseMinorWords &&
      MINOR_WORDS.has(word.replaceAll(/\P{L}/gu, '').toLowerCase())
    ) {
      return word
    }
    return leading + initial.toUpperCase() + word.slice(leading.length + 1)
  })
  let spanIndex = 0
  return converted.replaceAll(OPAQUE, () => spans[spanIndex++])
}

export const convertersMap: Record<CasingKind, (value: string) => string> = {
  camelCase,
  'kebab-case': kebabCase,
  PascalCase: pascalCase,
  snake_case: snakeCase,
  'Title Case': titleCase,
  'Train-Case': trainCase,
  SCREAMING_SNAKE_CASE: (str: string) => snakeCase(str).toUpperCase(),
}

/**
 * Creates a converter that reports whether a value already has a casing.
 *
 * Casings other than Title Case cannot convert names containing expressions or
 * code spans without rewriting them, so such names are left unchanged.
 *
 * @param caseType - Casing to convert to.
 * @param options - Conversion options.
 * @returns A function returning the converted value and whether it changed.
 */
export function getExactConverter(
  caseType: string,
  options: CasingOptions = {},
) {
  const convert = convertersMap[caseType as CasingKind]
  return (source: string) => {
    let value = source
    if (caseType === CASING.titleCase) {
      value = titleCase(source, options)
    } else if (!hasOpaqueSpan(source)) {
      value = convert(source)
    }
    const changed = value !== source
    return {
      value,
      changed,
    }
  }
}
