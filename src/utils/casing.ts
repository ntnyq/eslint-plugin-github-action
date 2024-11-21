/**
 * @file Casing utils
 */

import { camelCase, kebabCase, pascalCase, snakeCase, titleCase, trainCase } from '@ntnyq/utils'

export const allowedCaseOptions = [
  'camelCase',
  'kebab-case',
  'PascalCase',
  'snake_case',
  'Title Case',
  'Train-Case',
  'SCREAMING_SNAKE_CASE',
]
export type CasingKind =
  | 'camelCase'
  | 'kebab-case'
  | 'PascalCase'
  | 'snake_case'
  | 'Title Case'
  | 'Train-Case'
  | 'SCREAMING_SNAKE_CASE'

export const convertersMap: Record<CasingKind, (value: string) => string> = {
  camelCase,
  'kebab-case': kebabCase,
  PascalCase: pascalCase,
  snake_case: snakeCase,
  'Title Case': titleCase,
  'Train-Case': trainCase,
  SCREAMING_SNAKE_CASE: (str: string) => snakeCase(str).toUpperCase(),
}

export function getExactConverter(caseType: string) {
  const convert = convertersMap[caseType as CasingKind]
  return (source: string) => {
    const value = convert(source)
    const changed = value !== source
    return {
      value,
      changed,
    }
  }
}
