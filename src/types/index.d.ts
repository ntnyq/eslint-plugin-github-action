import type { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'

export type ASTNode = TSESTree.Node
export type Token = TSESTree.Token
export type NodeTypes = `${AST_NODE_TYPES}`

export type { JSONSchema, TSESTree as Tree } from '@typescript-eslint/utils'
export type { RuleWithMeta, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils'
export type {
  EcmaVersion,
  ReportDescriptor,
  ReportFixFunction,
  RuleContext,
  RuleFixer,
  RuleFunction,
  RuleListener,
  RuleModule,
  Scope,
  SourceCode,
} from '@typescript-eslint/utils/ts-eslint'
