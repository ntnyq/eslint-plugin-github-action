import { describe, expect, it } from 'vitest'
import {
  CASING,
  getExactConverter,
  hasOpaqueSpan,
  maskOpaqueSpans,
  titleCase,
} from '../../src/utils/casing'

const CASING_FIXTURES = Object.values(CASING)

describe('getExactConverter', () => {
  it('to camelCase', () => {
    const camelCase = getExactConverter(CASING.camelCase)
    expect(CASING_FIXTURES.map(camelCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": false,
          "value": "camelCase",
        },
        {
          "changed": true,
          "value": "kebabCase",
        },
        {
          "changed": true,
          "value": "pascalCase",
        },
        {
          "changed": true,
          "value": "snakeCase",
        },
        {
          "changed": true,
          "value": "titleCase",
        },
        {
          "changed": true,
          "value": "trainCase",
        },
        {
          "changed": true,
          "value": "screamingSnakeCase",
        },
      ]
    `)
  })

  it('to kebabCase', () => {
    const kebabCase = getExactConverter(CASING.kebabCase)
    expect(CASING_FIXTURES.map(kebabCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "camel-case",
        },
        {
          "changed": false,
          "value": "kebab-case",
        },
        {
          "changed": true,
          "value": "pascal-case",
        },
        {
          "changed": true,
          "value": "snake-case",
        },
        {
          "changed": true,
          "value": "title-case",
        },
        {
          "changed": true,
          "value": "train-case",
        },
        {
          "changed": true,
          "value": "screaming-snake-case",
        },
      ]
    `)
  })

  it('to pascalCase', () => {
    const pascalCase = getExactConverter(CASING.pascalCase)
    expect(CASING_FIXTURES.map(pascalCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "CamelCase",
        },
        {
          "changed": true,
          "value": "KebabCase",
        },
        {
          "changed": false,
          "value": "PascalCase",
        },
        {
          "changed": true,
          "value": "SnakeCase",
        },
        {
          "changed": true,
          "value": "TitleCase",
        },
        {
          "changed": true,
          "value": "TrainCase",
        },
        {
          "changed": true,
          "value": "ScreamingSnakeCase",
        },
      ]
    `)
  })

  it('to snakeCase', () => {
    const snakeCase = getExactConverter(CASING.snakeCase)
    expect(CASING_FIXTURES.map(snakeCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "camel_case",
        },
        {
          "changed": true,
          "value": "kebab_case",
        },
        {
          "changed": true,
          "value": "pascal_case",
        },
        {
          "changed": false,
          "value": "snake_case",
        },
        {
          "changed": true,
          "value": "title_case",
        },
        {
          "changed": true,
          "value": "train_case",
        },
        {
          "changed": true,
          "value": "screaming_snake_case",
        },
      ]
    `)
  })

  it('to titleCase', () => {
    const titleCase = getExactConverter(CASING.titleCase)
    expect(CASING_FIXTURES.map(titleCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "Camel Case",
        },
        {
          "changed": true,
          "value": "Kebab Case",
        },
        {
          "changed": true,
          "value": "Pascal Case",
        },
        {
          "changed": true,
          "value": "Snake Case",
        },
        {
          "changed": false,
          "value": "Title Case",
        },
        {
          "changed": true,
          "value": "Train Case",
        },
        {
          "changed": true,
          "value": "Screaming Snake Case",
        },
      ]
    `)
  })

  it('to trainCase', () => {
    const trainCase = getExactConverter(CASING.trainCase)
    expect(CASING_FIXTURES.map(trainCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "Camel-Case",
        },
        {
          "changed": true,
          "value": "Kebab-Case",
        },
        {
          "changed": true,
          "value": "Pascal-Case",
        },
        {
          "changed": true,
          "value": "Snake-Case",
        },
        {
          "changed": true,
          "value": "Title-Case",
        },
        {
          "changed": false,
          "value": "Train-Case",
        },
        {
          "changed": true,
          "value": "Screaming-Snake-Case",
        },
      ]
    `)
  })

  it('to screamingSnakeCase', () => {
    const screamingSnakeCase = getExactConverter(CASING.screamingSnakeCase)
    expect(CASING_FIXTURES.map(screamingSnakeCase)).toMatchInlineSnapshot(`
      [
        {
          "changed": true,
          "value": "CAMEL_CASE",
        },
        {
          "changed": true,
          "value": "KEBAB_CASE",
        },
        {
          "changed": true,
          "value": "PASCAL_CASE",
        },
        {
          "changed": true,
          "value": "SNAKE_CASE",
        },
        {
          "changed": true,
          "value": "TITLE_CASE",
        },
        {
          "changed": true,
          "value": "TRAIN_CASE",
        },
        {
          "changed": false,
          "value": "SCREAMING_SNAKE_CASE",
        },
      ]
    `)
  })
})

describe('titleCase', () => {
  it.each([
    ['lint the code', 'Lint The Code'],
    ['Deploy to AWS (CI)', 'Deploy To AWS (CI)'],
    ['Build & test on Node.js', 'Build & Test On Node.js'],
    ['CI', 'CI'],
    ['  unit test\n', 'Unit Test'],
    [
      `run \`npm test\` on \${{ matrix.os }}`,
      `Run \`npm test\` On \${{ matrix.os }}`,
    ],
    [`\${{ matrix.name }}`, `\${{ matrix.name }}`],
    [`test \${{ '}}' }} and \${{ 1`, `Test \${{ '}}' }} And \${{ 1`],
    ['use a ` backtick', 'Use A ` Backtick'],
    ['build 2 targets', 'Build 2 Targets'],
    ['unitTest', 'Unit Test'],
    ['unit_test', 'Unit Test'],
    ['Unit-Test', 'Unit Test'],
    ['!', ''],
  ])('converts %j to %j', (value, expected) => {
    expect(titleCase(value)).toBe(expected)
  })

  it.each([
    ['the build and test of the app', 'The Build and Test of the App'],
    ['Test On Node', 'Test On Node'],
    [`\${{ matrix.os }} on linux`, `\${{ matrix.os }} on Linux`],
    ['lint (and test)', 'Lint (and Test)'],
  ])('keeps minor words as written: %j to %j', (value, expected) => {
    expect(titleCase(value, { allowLowercaseMinorWords: true })).toBe(expected)
  })
})

describe('maskOpaqueSpans', () => {
  it('replaces expressions and code spans in source order', () => {
    const { masked, spans } = maskOpaqueSpans(`a \${{ x }} \`b\` c \`d`)
    expect(masked).toBe('a \u{E000} \u{E000} c `d')
    expect(spans).toEqual([`\${{ x }}`, '`b`'])
  })

  it('extends an unclosed expression to the end', () => {
    expect(maskOpaqueSpans(`a \${{ b`).spans).toEqual([`\${{ b`])
  })

  it('detects opaque spans', () => {
    expect(hasOpaqueSpan('Run `npm test`')).toBe(true)
    expect(hasOpaqueSpan('Run Tests')).toBe(false)
  })
})

describe('getExactConverter with opaque spans', () => {
  it('leaves names with expressions unchanged for other casings', () => {
    expect(
      getExactConverter(CASING.kebabCase)(`Test \${{ matrix.os }}`),
    ).toEqual({ value: `Test \${{ matrix.os }}`, changed: false })
  })

  it('converts names with expressions in Title Case', () => {
    expect(
      getExactConverter(CASING.titleCase)(`test \${{ matrix.os }}`),
    ).toEqual({ value: `Test \${{ matrix.os }}`, changed: true })
  })
})
