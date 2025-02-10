/**
 * @file Utils for YAML AST
 *
 * @see {@link https://github.com/ota-meshi/yaml-eslint-parser/blob/master/docs/AST.md}
 * @copyright {@link https://github.com/ota-meshi/eslint-plugin-yml/blob/master/src/utils/ast-utils.ts}
 */

import type { YAMLAst, YAMLComment, YAMLToken } from '../types/yaml'

/**
 * Checks if the given value is a YAMLScalar.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLScalar.
 */
export function isYAMLScalar(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLScalar {
  return value?.type === 'YAMLScalar'
}

/**
 * Checks if the given value is a YAMLMapping.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLMapping.
 */
export function isYAMLMapping(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLMapping {
  return value?.type === 'YAMLMapping'
}

/**
 * Checks if the given value is a YAMLSequence.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLSequence.
 */
export function isYAMLSequence(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLSequence {
  return value?.type === 'YAMLSequence'
}

/**
 * Checks if the given value is a YAMLComment.
 * @param token - The value to check.
 * @returns Whether the given value is a YAMLComment.
 */
export function isYAMLComment(
  token: YAMLToken | YAMLComment | null,
): token is YAMLComment {
  return token?.type === 'Block' || token?.type === 'Line'
}

/**
 * Checks if the given token is on the same line as the target token.
 * @param token - The token to check.
 * @param target - The target token.
 * @returns Whether the given token is on the same line as the target token.
 */
export function isTokenOnSameLine(token: YAMLToken, target: YAMLToken) {
  return token.loc.start.line === target.loc.start.line
}

/**
 * Check whether the given token is a question.
 * @param token - The token to check.
 * @returns `true` if the token is a question.
 */
export function isQuestion(token: YAMLToken | null): token is YAMLToken {
  return token?.type === 'Punctuator' && token?.value === '?'
}

/**
 * Check whether the given token is a hyphen.
 * @param token - The token to check.
 * @returns `true` if the token is a hyphen.
 */
export function isHyphen(token: YAMLToken | null): token is YAMLToken {
  return token?.type === 'Punctuator' && token?.value === '-'
}

/**
 * Check whether the given token is a colon.
 * @param token - The token to check.
 * @returns `true` if the token is a colon.
 */
export function isColon(token: YAMLToken | null): token is YAMLToken {
  return token?.type === 'Punctuator' && token?.value === ':'
}

/**
 * Check whether the given token is a comma.
 * @param token - The token to check.
 * @returns `true` if the token is a comma.
 */
export function isComma(token: YAMLToken | null): token is YAMLToken {
  return token?.type === 'Punctuator' && token?.value === ','
}

/**
 * Checks if the given token is an opening square bracket token or not.
 * @param token - The token to check.
 * @returns `true` if the token is an opening square bracket token.
 */
export function isOpeningBracketToken(
  token: YAMLToken | null,
): token is YAMLToken {
  return token?.value === '[' && token?.type === 'Punctuator'
}

/**
 * Checks if the given token is a closing square bracket token or not.
 * @param token - The token to check.
 * @returns `true` if the token is a closing square bracket token.
 */
export function isClosingBracketToken(
  token: YAMLToken | null,
): token is YAMLToken {
  return token?.value === ']' && token?.type === 'Punctuator'
}

/**
 * Checks if the given token is an opening brace token or not.
 * @param token - The token to check.
 * @returns `true` if the token is an opening brace token.
 */
export function isOpeningBraceToken(
  token: YAMLToken | null,
): token is YAMLToken {
  return token?.value === '{' && token?.type === 'Punctuator'
}

/**
 * Checks if the given token is a closing brace token or not.
 * @param token - The token to check.
 * @returns `true` if the token is a closing brace token.
 */
export function isClosingBraceToken(
  token: YAMLToken | null,
): token is YAMLToken {
  return token?.value === '}' && token?.type === 'Punctuator'
}
